import pandas as pd
import io
from pandas.errors import ParserError

def read_file_to_dataframe(file):
    """
    Lee un archivo (CSV, Excel, Parquet) devolviendo un DataFrame.
    Maneja errores de encoding y filas mal formadas.
    """
    file.seek(0)
    filename = file.filename.lower()

    try:
        if filename.endswith('.csv'):
            # Modificamos la lista para incluir el 'modo de error'.
            # 1. Intentamos STRICT primero. Si es Latin-1, UTF-8 strict fallará (que es lo que queremos)
            #    y pasará al siguiente.
            # 2. Dejamos una opción final con 'replace' por si es un archivo basura (como el del error 0x8d).
            attempts = [
                # (encoding, separador, comportamiento_error)
                ('utf-8-sig', ',', 'strict'),
                ('utf-8-sig', ';', 'strict'),
                ('latin-1', ',', 'strict'),
                ('latin-1', ';', 'strict'),
                # El "Salvavidas" para tu archivo corrupto anterior (el del 0x8d):
                ('cp1252', ';', 'replace'), 
                ('cp1252', ',', 'replace')
            ]

            last_error = None

            for encoding, sep, error_mode in attempts:
                try:
                    file.seek(0)
                    
                    df = pd.read_csv(
                        file, 
                        sep=sep, 
                        encoding=encoding, 
                        dtype=str,
                        encoding_errors=error_mode,
                        on_bad_lines='skip', 
                        engine='python' 
                    )

                    # Validación de falso positivo con coma
                    if sep == ',':
                        if len(df.columns) > 0 and ';' in str(df.columns[0]):
                            raise ParserError("Falso positivo con coma: El encabezado contiene ';'")

                    return df

                except (UnicodeDecodeError, ParserError, Exception) as e:
                    last_error = e
                    continue 

            raise ValueError(f"No se pudo leer el archivo CSV. Último error: {last_error}")

        elif filename.endswith(('.xls', '.xlsx')):
            return pd.read_excel(file, dtype=str)

        elif filename.endswith('.parquet'):
            return pd.read_parquet(file)

        else:
            raise ValueError("Formato de archivo no soportado.")

    except Exception as e:
        raise ValueError(f"Error procesando el archivo: {str(e)}")