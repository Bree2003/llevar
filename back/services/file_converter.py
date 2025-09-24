import pandas as pd
import os
import tempfile


def convert_to_parquet(file_stream, filename):
    """
    Convierte CSV o Excel a Parquet.
    Devuelve la ruta al archivo parquet temporal.
    """
    ext = filename.split('.')[-1].lower()

    # Crear DataFrame desde el archivo
    if ext == "csv":
        df = pd.read_csv(file_stream)
    elif ext in ("xlsx", "xls"):
        df = pd.read_excel(file_stream)
    else:
        raise ValueError("Formato no soportado. Usa CSV o Excel.")

    # Crear archivo parquet temporal
    tmp_dir = tempfile.gettempdir()
    parquet_path = os.path.join(
        tmp_dir, f"{os.path.splitext(filename)[0]}.parquet")

    df.to_parquet(parquet_path, engine="pyarrow", index=False)
    return parquet_path
