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

def create_table_entity(project_id, dataset_id, table_id, schema_data, metadata):
    """
    Crea una nueva tabla en BigQuery donde TODAS las columnas son STRING
    para garantizar una ingesta robusta (Raw Zone).
    """
    try:
        client = bigquery.Client(project=project_id)
        table_ref = f"{project_id}.{dataset_id}.{table_id}"

        # Construir el esquema de BigQuery
        schema = []
        column_descriptions = metadata.get('columnDescriptions', {})

        for col in schema_data:
            col_name = col['nombre']
            
            # Obtenemos la descripción del usuario
            description = column_descriptions.get(col_name, "")

            field = bigquery.SchemaField(
                name=col_name,
                field_type="STRING", 
                mode="NULLABLE",
                description=description
            )
            schema.append(field)

        # Configurar la tabla
        table = bigquery.Table(table_ref, schema=schema)
        table.description = metadata.get('tableDescription', "")

        # Crear la tabla
        table = client.create_table(table, exists_ok=True)
        
        print(f"Tabla Raw (String) creada exitosamente en BQ: {table_ref}")
        return table

    except Exception as e:
        print(f"Error fatal creando tabla en BigQuery: {e}")
        raise e