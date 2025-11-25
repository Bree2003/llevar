# app/utils/file_processing.py
import pandas as pd
import os


def read_file_to_dataframe(file_storage):
    """
    Lee un archivo en memoria y lo devuelve como DataFrame (dtype=str).
    """
    try:
        filename = getattr(file_storage, 'filename', 'unknown_file')
        ext = os.path.splitext(filename)[1].lower().lstrip('.')

        df = None

        if ext == 'csv':
            file_storage.seek(0)
            try:
                # Intento 1: Auto-detección de separador (más robusto)
                df = pd.read_csv(
                    file_storage,
                    sep=None,
                    engine='python',
                    encoding='latin1',
                    dtype=str,
                    keep_default_na=False
                )
                print("[INFO] CSV leído con engine='python' (auto-sep).")
            except Exception:
                file_storage.seek(0)
                try:
                    # Intento 2: UTF-8 explícito
                    df = pd.read_csv(
                        file_storage,
                        sep=None,
                        engine='python',
                        encoding='utf-8',
                        dtype=str,
                        keep_default_na=False
                    )
                except Exception as e:
                    raise ValueError(
                        f"No se pudo leer CSV '{filename}'. Error: {e}")

        elif ext in ['xlsx', 'xls']:
            file_storage.seek(0)
            df = pd.read_excel(file_storage, dtype=str)

        else:
            raise ValueError(f"Formato '{ext}' no soportado.")

        # Convertimos NaN a None (string vacío o null según prefieras)
        # Como usamos dtype=str y keep_default_na=False,
        # los vacíos suelen ser strings vacíos "".
        return df

    except Exception as e:
        raise ValueError(f"Error procesando '{filename}': {e}")
