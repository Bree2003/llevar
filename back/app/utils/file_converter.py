# file_converter.py
import os
import tempfile
import pandas as pd

def dataframe_to_parquet_tempfile(df: pd.DataFrame, original_filename: str) -> str:
    """
    Convierte un DataFrame de pandas a un archivo Parquet temporal, aplicando
    transformaciones de limpieza necesarias.

    - Valida que la entrada sea un DataFrame.
    - Renombra columnas que contienen 'ñ' o 'Ñ' (ej: 'año' -> 'anio').
    
    Args:
        df: El DataFrame a convertir. Se asume que ya viene con dtype=str para las columnas de texto.
        original_filename: El nombre del archivo original para nombrar el archivo temporal.
    
    Returns:
        La ruta (string) al archivo Parquet temporal creado.
    """
    if not isinstance(df, pd.DataFrame):
        raise TypeError("La entrada para la conversión a Parquet debe ser un DataFrame de pandas.")
    
    try:
        # Trabajar con una copia para no alterar el DataFrame original
        df_limpio = df.copy()
        
        # 1. Renombrar columnas que contienen 'ñ' o 'Ñ' por 'ni'
        # Esto asegura que las columnas sean compatibles con sistemas que no manejan caracteres especiales.
        nuevas_columnas = {}
        for col in df_limpio.columns:
            # Aplicamos el reemplazo solo si el carácter está presente
            if 'ñ' in col or 'Ñ' in col:
                nuevas_columnas[col] = col.replace('ñ', 'ni').replace('Ñ', 'Ni')
            else:
                # Si no hay 'ñ', no es necesario renombrar
                nuevas_columnas[col] = col 
        
        # Si se encontraron columnas para renombrar, aplicamos el cambio
        if nuevas_columnas:
            df_limpio.rename(columns=nuevas_columnas, inplace=True)
            print(f"  -> Columnas renombradas si contenían 'ñ': {list(nuevas_columnas.values())}")

        # Crear un archivo Parquet temporal
        tmp_dir = tempfile.gettempdir()
        base_name = os.path.splitext(original_filename)[0]
        parquet_path = os.path.join(tmp_dir, f"{base_name}.parquet")
        
        # Guardar el DataFrame limpio en formato Parquet
        df_limpio.to_parquet(parquet_path, engine="pyarrow", index=False)
        
        return parquet_path
    
    except Exception as e:
        # Si algo falla en la transformación o guardado, lanzamos una excepción clara.
        raise IOError(f"Error al convertir el DataFrame a Parquet para '{original_filename}': {str(e)}")