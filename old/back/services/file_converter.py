import pandas as pd
import os
import tempfile

def convert_to_parquet(file_stream, filename):
    """
    Convierte CSV o Excel a Parquet, manejando diferentes codificaciones de CSV
    y limpiando los tipos de datos ambiguos antes de la conversión.
    Devuelve la ruta al archivo parquet temporal.
    """
    file_stream.seek(0)
    ext = filename.split('.')[-1].lower()

    # Crear DataFrame desde el archivo en memoria
    if ext == "csv":
        try:
            # --- ¡ESTA ES LA PARTE ACTUALIZADA! ---
            # 1. Intenta leer con la codificación estándar UTF-8.
            #    Añadimos sep=None y engine='python' para que pandas intente
            #    detectar automáticamente si el separador es ',' o ';'.
            df = pd.read_csv(file_stream, sep=None, engine='python')
        except UnicodeDecodeError:
            # 2. Si UTF-8 falla, es un error de codificación.
            #    Reiniciamos el stream y lo intentamos de nuevo con 'latin-1',
            #    que es muy común en archivos generados por Excel.
            print("Decodificación UTF-8 fallida. Reintentando con codificación latin-1.")
            file_stream.seek(0)
            df = pd.read_csv(file_stream, encoding='latin-1', sep=None, engine='python')

    elif ext in ("xlsx", "xls"):
        df = pd.read_excel(file_stream)
    else:
        raise ValueError("Formato no soportado. Usa CSV o Excel.")

    # La limpieza de datos que resolvía el problema anterior sigue siendo crucial
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].astype(str).fillna('NA')

    # Crear archivo parquet temporal
    tmp_dir = tempfile.gettempdir()
    parquet_path = os.path.join(
        tmp_dir, f"{os.path.splitext(filename)[0]}.parquet")

    df.to_parquet(parquet_path, engine="pyarrow", index=False)
    
    return parquet_path