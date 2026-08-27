from google.cloud import bigquery
import pandas as pd


def get_table_schema(project_id, dataset_id, table_id):
    """
    Obtiene el esquema de una tabla de BigQuery.
    """
    try:
        client = bigquery.Client(project=project_id)
        table_ref = f"{project_id}.{dataset_id}.{table_id}"
        table = client.get_table(table_ref)

        schema_map = {}
        for field in table.schema:
            schema_map[field.name] = {
                'type': field.field_type,
                'mode': field.mode  # 'NULLABLE', 'REQUIRED'
            }
        return schema_map
    except Exception as e:
        # Si la tabla no existe o no hay permisos
        print(f"BQ Error ({project_id}.{dataset_id}.{table_id}): {e}")
        return None


def validate_dataframe_against_schema(df, bq_schema):
    """
    Compara las columnas del DF contra el esquema de BQ.
    """
    errores = []  # Bloqueantes
    alertas = []  # No bloqueantes

    if not bq_schema:
        return [], ["No se encontró la tabla en BigQuery o no tiene esquema. Por favor, verifica que el destino sea correcto o intenta con otra tabla"]

    # Normalizamos a minúsculas para evitar problemas de case-sensitivity
    df_cols = set(x.lower() for x in df.columns)
    bq_cols = {k.lower(): v for k, v in bq_schema.items()}

    # 1. Columnas que faltan en el archivo (y son REQUIRED en BQ)
    for col_name, props in bq_cols.items():
        if col_name not in df_cols:
            if props['mode'] == 'REQUIRED':
                errores.append(
                    f"CRÍTICO: Falta la columna obligatoria '{col_name}' en el archivo.")
            else:
                alertas.append(
                    f"Aviso: La columna '{col_name}' existe en BQ pero no en el archivo (se llenará con NULL).")

    # 2. Columnas extra en el archivo (que no están en BQ)
    for col in df_cols:
        if col not in bq_cols:
            alertas.append(
                f"Aviso: El archivo trae la columna nueva '{col}' que no existe en BigQuery.")

    return errores, alertas


def load_parquet_from_gcs_to_bq(project_id, dataset_id, table_id, gcs_uri):
    """
    Carga un archivo Parquet desde GCS a una tabla de BigQuery.
    Modo: WRITE_TRUNCATE (Sobrescribe la tabla con la nueva data) o WRITE_APPEND.
    Para edición de datos, generalmente queremos TRUNCATE (reemplazo total) 
    o APPEND si es versionado histórico. 
    """
    client = bigquery.Client(project=project_id)
    table_ref = f"{project_id}.{dataset_id}.{table_id}"

    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.PARQUET,
        # Opciones:
        # WRITE_TRUNCATE: Borra datos y escribe los nuevos (Ideal para "Guardar Cambios")
        # WRITE_APPEND: Agrega al final (Histórico)
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        autodetect=True
    )

    try:
        load_job = client.load_table_from_uri(
            gcs_uri, table_ref, job_config=job_config
        )

        print(
            f"Iniciando job de carga {load_job.job_id} desde {gcs_uri} a {table_ref}...")

        load_job.result()  # Espera a que termine

        print(f"Job terminado. Filas cargadas: {load_job.output_rows}")
        return load_job.output_rows

    except Exception as e:
        print(f"Error cargando datos a BQ: {e}")
        raise e
    
def create_table_entity(project_id, dataset_id, table_id, schema_data, gcs_root_path, metadata=None):
    """
    Crea una nueva tabla externa en BigQuery con esquema STRING + Columnas de Partición.
    Esta tabla está apuntando a GCS con particionamiento Hive.
    
    Args:
        gcs_root_path (str): Ruta base en GCS sin el "gs://bucket/". 
                             Ej: "manual/maestro-fert" (SIN el year=... ni nombre de archivo)
    """
    client = bigquery.Client(project=project_id)
    full_table_id = f"{project_id}.{dataset_id}.{table_id}"
    
    # Construir la definición de columnas (DDL)
    columns_ddl = []
    meta = metadata if metadata else {}
    column_descriptions = meta.get('columnDescriptions', {})
    
    for col in schema_data:
        col_name = col['nombre'] if isinstance(col, dict) else col
        if col_name.lower() in ['year', 'month', 'day']:
            continue
            
        desc = column_descriptions.get(col_name, "")
        # Escapamos comillas en la descripción por si acaso
        desc = desc.replace('"', "'")
        columns_ddl.append(f"`{col_name}` STRING OPTIONS(description=\"{desc}\")")
    
    columns_str = ",\n  ".join(columns_ddl)
    
    
    uri_pattern = f"{gcs_root_path}/*"
    
    description = meta.get('tableDescription', "Tabla externa creada automáticamente desde Plataforma del Front.")
    # Query DDL
    query = f"""
    CREATE OR REPLACE EXTERNAL TABLE `{full_table_id}`
    (
      {columns_str}
    )
    WITH PARTITION COLUMNS (
      year STRING,  -- Definimos particiones como STRING para coincidir con el parquet
      month STRING,
      day STRING
    )
    OPTIONS (
      description = "{description}",
      uris = ['{uri_pattern}'],
      format = "PARQUET",
      hive_partition_uri_prefix = '{gcs_root_path}',
      require_hive_partition_filter = false
    );
    """
    
    print(f"Ejecutando DDL para tabla externa: {full_table_id}")
    try:
        query_job = client.query(query)
        query_job.result() # Esperar a que termine
        table = client.get_table(full_table_id)
        
        # Definimos los labels
        labels = {
            "tipo": "ext"
        }
        
        table.labels = labels
        client.update_table(table, ["labels"])
        print(f"Tabla externa creada exitosamente: {full_table_id}")
        return True
    except Exception as e:
        print(f"Error creando tabla externa: {e}")
        raise e

def create_table_cuadratura_csv(project_id, table_id, schema_data, bucket_name, nombre_tabla, field_delimiter):
    """
    Crea una tabla externa en el dataset fijo:
      <project_id>.cuadraturas.<table_id>

    Apunta a:
      gs://<bucket_name>/cuadraturas/<nombre_tabla>/*

    CSV + Hive partitions year/month/day, sin descripciones.
    """
    client = bigquery.Client(project=project_id)

    dataset_id = "cuadraturas"
    full_table_id = f"{project_id}.{dataset_id}.{table_id}"

    # Columnas: todo STRING, sin descripción
    columns_ddl = []
    for col in schema_data:
        col_name = col['nombre'] if isinstance(col, dict) else col

        if not isinstance(col_name, str):
            continue

        if col_name.lower() in ['year', 'month', 'day']:
            continue
        columns_ddl.append(f"`{col_name}` STRING")

    columns_str = ",\n  ".join(columns_ddl)

    gcs_root_path = f"gs://{bucket_name}/cuadraturas/{nombre_tabla}"
    uri_pattern = f"{gcs_root_path}/*"

    query = f"""
    CREATE OR REPLACE EXTERNAL TABLE `{full_table_id}`
    (
      {columns_str}
    )
    WITH PARTITION COLUMNS (
      year STRING,
      month STRING,
      day STRING
    )
    OPTIONS (
      uris = ['{uri_pattern}'],
      format = "CSV",
      hive_partition_uri_prefix = '{gcs_root_path}',
      skip_leading_rows = 1,
      field_delimiter = '{field_delimiter}',
      require_hive_partition_filter = false
    );
    """

    query_job = client.query(query)
    query_job.result()

    table = client.get_table(full_table_id)
    table.labels = {"tipo": "ext"}
    client.update_table(table, ["labels"])
    return True