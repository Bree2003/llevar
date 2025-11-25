# file_converter.py
import os
import tempfile
import pandas as pd
import unicodedata


def clean_text_series(series: pd.Series) -> pd.Series:
    """
    Toma una serie de pandas (columna) y:
    1. Reemplaza ñ/Ñ por ni/Ni.
    2. Elimina tildes y diacríticos (á -> a).
    3. Mantiene el texto en formato ASCII limpio.
    """
    # 1. Reemplazo específico de ñ (antes de normalizar, porque si no ñ -> n)
    # Usamos .str.replace con regex=False para velocidad
    series = series.str.replace('ñ', 'ni', case=False, regex=False)
    series = series.str.replace('Ñ', 'Ni', case=False, regex=False)

    # 2. Normalización Unicode (NFKD separa caracteres de sus tildes)
    # Ej: "á" se convierte en "a" + "´"
    # Luego codificamos a ASCII ignorando errores (borra el "´") y decodificamos a utf-8
    return (series
            .str.normalize('NFKD')
            .str.encode('ascii', errors='ignore')
            .str.decode('utf-8'))


def dataframe_to_parquet_tempfile(df: pd.DataFrame, original_filename: str) -> str:
    """
    Convierte un DataFrame de pandas a un archivo Parquet temporal, limpiando 
    tildes, 'ñ' y caracteres especiales tanto en DATOS como en COLUMNAS.
    """
    if not isinstance(df, pd.DataFrame):
        raise TypeError("La entrada debe ser un DataFrame de pandas.")

    try:
        # Trabajamos con una copia para no alterar el original
        df_limpio = df.copy()

        # --- FASE 1: Limpieza de DATOS (Filas) ---
        # Iteramos sobre todas las columnas.
        # Como file_processing.py forzó dtype=str,
        # podemos aplicar operaciones de string vectorizadas (muy rápido).
        for col in df_limpio.columns:
            # Solo aplicamos si la columna es de tipo objeto/string
            # (redundante pero seguro)
            if df_limpio[col].dtype == 'object' or isinstance(df_limpio[col].dtype, pd.StringDtype):
                df_limpio[col] = clean_text_series(df_limpio[col].astype(str))

        # --- FASE 2: Limpieza de COLUMNAS (Encabezados) ---
        new_columns = []
        for col in df_limpio.columns:
            # Aplicamos la misma lógica: ñ->ni y luego quitar tildes
            clean_col = col.replace('ñ', 'ni').replace('Ñ', 'Ni')
            clean_col = unicodedata.normalize('NFKD', clean_col)\
                .encode('ascii', 'ignore')\
                .decode('utf-8')
            new_columns.append(clean_col)

        df_limpio.columns = new_columns

        print(
            "[INFO] Limpieza completa (ñ->ni y sin tildes) aplicada a datos y columnas.")

        # --- FASE 3: Guardado ---
        tmp_dir = tempfile.gettempdir()
        base_name = os.path.splitext(original_filename)[0]
        # Limpiamos también el nombre del archivo por si acaso
        base_name_clean = unicodedata.normalize('NFKD', base_name)\
            .encode('ascii', 'ignore').decode('utf-8')

        parquet_path = os.path.join(tmp_dir, f"{base_name_clean}.parquet")

        df_limpio.to_parquet(parquet_path, engine="pyarrow", index=False)

        return parquet_path

    except Exception as e:
        raise IOError(f"Error al convertir DataFrame a Parquet: {str(e)}")
