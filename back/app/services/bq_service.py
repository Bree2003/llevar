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
        return [], ["No se encontró la tabla en BigQuery o no tiene esquema. Se creará una nueva (si aplica)."]

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
