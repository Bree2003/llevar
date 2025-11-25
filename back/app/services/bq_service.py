from google.cloud import bigquery
import pandas as pd


def get_bq_client(project_id):
    return bigquery.Client(project=project_id)


def get_table_schema(project_id, dataset_id, table_id):
    """
    Obtiene el esquema de una tabla de BigQuery.
    Retorna un diccionario { 'nombre_columna': { 'type': 'STRING', 'mode': 'REQUIRED' } }
    """
    try:
        client = get_bq_client(project_id)
        table_ref = f"{project_id}.{dataset_id}.{table_id}"
        table = client.get_table(table_ref)

        schema_map = {}
        for field in table.schema:
            schema_map[field.name] = {
                'type': field.field_type,
                'mode': field.mode  # 'NULLABLE', 'REQUIRED', 'REPEATED'
            }
        return schema_map
    except Exception as e:
        print(f"Error obteniendo esquema de BQ: {e}")
        return None


def validate_dataframe_against_schema(df, bq_schema):
    """
    Compara el DataFrame de Pandas contra el esquema de BigQuery.
    Retorna:
        - errors: Lista de strings con errores bloqueantes (impiden ingesta).
        - warnings: Lista de strings con alertas (permiten ingesta).
    """
    errors = []
    warnings = []

    if not bq_schema:
        return ["No se pudo recuperar el esquema de la tabla destino o la tabla no existe."], []

    # Convertimos las columnas del DF a un set para búsqueda rápida
    df_columns = set(df.columns)
    bq_columns = set(bq_schema.keys())

    # --- VALIDACIÓN 1: Columnas Faltantes (Error Crítico) ---
    # Columnas que están en BQ pero NO en el archivo
    missing_in_file = bq_columns - df_columns
    for col in missing_in_file:
        # Si la columna en BQ es REQUIRED (no nula) y falta en el archivo -> ERROR
        if bq_schema[col]['mode'] == 'REQUIRED':
            errors.append(
                f"CRÍTICO: La columna obligatoria '{col}' falta en el archivo.")
        else:
            # Si es NULLABLE, puede faltar (se llenará con nulls), pero avisamos
            warnings.append(
                f"Aviso: La columna '{col}' existe en BQ pero no en el archivo (se llenará con NULL).")

    # --- VALIDACIÓN 2: Columnas Extra (Warning) ---
    # Columnas en el archivo que NO están en BQ
    extra_in_file = df_columns - bq_columns
    for col in extra_in_file:
        warnings.append(
            f"Aviso: El archivo trae la columna extra '{col}' que no existe en la tabla destino.")

    # --- VALIDACIÓN 3: Valores Nulos en Campos Obligatorios (Error Crítico) ---
    # Revisamos columnas comunes
    common_columns = df_columns.intersection(bq_columns)

    for col in common_columns:
        # Si BQ dice que es REQUIRED
        if bq_schema[col]['mode'] == 'REQUIRED':
            # Y el DataFrame tiene nulos en esa columna
            if df[col].isnull().any():
                null_count = df[col].isnull().sum()
                errors.append(
                    f"CRÍTICO: La columna '{col}' no acepta nulos, pero el archivo trae {null_count} registros vacíos.")

    # --- VALIDACIÓN 4: Tipos de Dato (Opcional/Avanzado) ---
    # Aquí podrías agregar lógica para ver si una columna numérica trae texto, etc.

    return errors, warnings
