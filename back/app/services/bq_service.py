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


def create_table_entity(project_id, dataset_id, table_id, schema_data, metadata=None):
    """
    Crea una nueva tabla en BigQuery con esquema STRING + Columnas de Partición.
    """
    try:
        client = bigquery.Client(project=project_id)
        table_ref = f"{project_id}.{dataset_id}.{table_id}"

        schema = []
        meta = metadata if metadata else {}
        column_descriptions = meta.get('columnDescriptions', {})

        # 1. Agregamos las columnas que vienen del archivo (Frontend)
        for col in schema_data:
            col_name = col['nombre'] if isinstance(col, dict) else col

            # Evitamos duplicados si por alguna razón ya venían en la data
            if col_name.lower() in ['year', 'month', 'day']:
                continue

            description = column_descriptions.get(col_name, "")
            field = bigquery.SchemaField(
                name=col_name,
                field_type="STRING",
                mode="NULLABLE",
                description=description
            )
            schema.append(field)

        # 2. --- CAMBIO CLAVE: Agregamos explícitamente las columnas de partición ---
        # Las definimos como STRING para mantener la consistencia de la Raw Zone
        schema.append(bigquery.SchemaField(
            "year", "STRING", "NULLABLE", "Partition Year"))
        schema.append(bigquery.SchemaField(
            "month", "STRING", "NULLABLE", "Partition Month"))
        schema.append(bigquery.SchemaField(
            "day", "STRING", "NULLABLE", "Partition Day"))

        table = bigquery.Table(table_ref, schema=schema)
        table.description = meta.get('tableDescription', "")

        # OPCIONAL: Configurar particionamiento nativo de BigQuery
        # Si quisieras que BQ optimice consultas usando estas columnas, podrías hacer:
        # table.clustering_fields = ["year", "month"]
        # (El particionamiento real por columna string es limitado, suele usarse clustering)

        table = client.create_table(table, exists_ok=True)

        print(f"Tabla creada con columnas de partición: {table_ref}")
        return table

    except Exception as e:
        print(f"Error creando tabla BQ: {e}")
        raise e


def load_parquet_from_gcs_to_bq(project_id, dataset_id, table_id, gcs_uri):
    """
    Carga un archivo Parquet desde GCS a una tabla de BigQuery.
    Modo: WRITE_TRUNCATE (Sobrescribe la tabla con la nueva data) o WRITE_APPEND.
    Para edición de datos, generalmente queremos TRUNCATE (reemplazo total) 
    o APPEND si es versionado histórico. 

    Dado que tu flujo es 'Actualizar Dataset', asumiremos que quieres que la 
    tabla en BQ refleje exactamente lo que el usuario ve y guardó.
    """
    client = bigquery.Client(project=project_id)
    table_ref = f"{project_id}.{dataset_id}.{table_id}"

    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.PARQUET,
        # Opciones:
        # WRITE_TRUNCATE: Borra datos y escribe los nuevos (Ideal para "Guardar Cambios")
        # WRITE_APPEND: Agrega al final (Histórico)
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,

        # IMPORTANTE: Como tus tablas raw son STRING, pero el Parquet puede traer
        # inferencias, a veces es útil autodetectar o forzar.
        # Sin embargo, como tú creas la tabla con esquema STRING explícito antes,
        # BQ intentará convertir. Parquet es binario y tipado, así que BQ suele
        # respetar los tipos del archivo.
        # Si tu tabla es STRING y el parquet trae INT, BQ hará casting si es posible.
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
        # Es vital propagar el error para que el endpoint sepa que falló la carga
        raise e
