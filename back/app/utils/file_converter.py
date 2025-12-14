import os
import tempfile
import pandas as pd
import unicodedata

def clean_text_series(series: pd.Series) -> pd.Series:
    """
    Limpia una serie: 
    1. Rellena nulos con "" (vacío).
    2. Convierte a string.
    3. ñ->ni, elimina tildes, normaliza a ASCII.
    """
    
    # --- CAMBIO IMPORTANTE ---
    # 1. Primero rellenamos los NaN/None con cadena vacía.
    # Si no hacemos esto, astype(str) convierte el NaN en la palabra literal "nan".
    series = series.fillna("")
    
    # 2. Ahora convertimos todo a string (asegura que números sean texto)
    series = series.astype(str)
    
    # 3. Reemplazo de ñ/Ñ
    series = series.str.replace('ñ', 'ni', case=False, regex=False)
    series = series.str.replace('Ñ', 'Ni', case=False, regex=False)

    # 4. Normalización (quitar tildes y caracteres raros)
    return (series
            .str.normalize('NFKD')
            .str.encode('ascii', errors='ignore')
            .str.decode('utf-8'))


def dataframe_to_parquet_tempfile(df: pd.DataFrame, original_filename: str) -> str:
    """
    Convierte TODO el DataFrame a Parquet.
    - Todo dato se vuelve texto (string).
    - Los nulos se vuelven vacíos "".
    - Se limpian tildes y ñ.
    """
    if not isinstance(df, pd.DataFrame):
        raise TypeError("La entrada debe ser un DataFrame de pandas.")

    try:
        # Trabajamos con una copia
        df_limpio = df.copy()

        # --- FASE 1: Limpieza de DATOS (Filas) ---
        # Iteramos sobre TODAS las columnas sin importar su tipo original
        for col in df_limpio.columns:
            # Aplicamos la limpieza que incluye fillna("") -> astype(str)
            df_limpio[col] = clean_text_series(df_limpio[col])

        # --- FASE 2: Limpieza de COLUMNAS (Encabezados) ---
        new_columns = []
        for col in df_limpio.columns:
            # Convertimos el nombre de la columna a string y limpiamos
            clean_col = str(col).replace('ñ', 'ni').replace('Ñ', 'Ni')
            clean_col = unicodedata.normalize('NFKD', clean_col)\
                .encode('ascii', 'ignore')\
                .decode('utf-8')
            new_columns.append(clean_col)

        df_limpio.columns = new_columns

        print("[INFO] Limpieza completa: Todo es texto, nulos son vacíos, sin tildes.")

        # --- FASE 3: Guardado ---
        tmp_dir = tempfile.gettempdir()
        base_name = os.path.splitext(original_filename)[0]
        base_name_clean = unicodedata.normalize('NFKD', base_name)\
            .encode('ascii', 'ignore').decode('utf-8')

        parquet_path = os.path.join(tmp_dir, f"{base_name_clean}.parquet")

        df_limpio.to_parquet(parquet_path, engine="pyarrow", index=False)

        return parquet_path

    except Exception as e:
        raise IOError(f"Error al convertir DataFrame a Parquet: {str(e)}")
    