import pandas as pd
import io


def read_file_to_dataframe(file):
    """
    Lee un archivo (CSV, Excel, Parquet) y devuelve un DataFrame.
    Maneja automáticamente el BOM de Excel.
    """
    # Guardamos la posición actual por si hay que rebobinar (si fallara un intento)
    file.seek(0)
    filename = file.filename.lower()

    try:
        if filename.endswith('.csv'):
            # --- EL CAMBIO CLAVE ESTÁ AQUÍ ---
            # 'utf-8-sig' maneja archivos CON y SIN BOM correctamente.
            # Es la opción más segura para archivos subidos por usuarios.
            try:
                return pd.read_csv(file, encoding='utf-8-sig')
            except UnicodeDecodeError:
                # Fallback: Si falla utf-8, intentamos con latin-1 (común en Windows antiguos)
                file.seek(0)
                return pd.read_csv(file, encoding='latin-1')

        elif filename.endswith(('.xls', '.xlsx')):
            return pd.read_excel(file)

        elif filename.endswith('.parquet'):
            return pd.read_parquet(file)

        else:
            raise ValueError(
                "Formato de archivo no soportado. Use CSV, Excel o Parquet.")

    except Exception as e:
        raise ValueError(f"Error procesando el archivo: {str(e)}")
