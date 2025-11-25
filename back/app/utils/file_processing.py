# app/utils/file_processing.py
import pandas as pd
import os 

def read_file_to_dataframe(file_storage):
    """
    Lee un archivo en memoria (CSV o Excel) y lo convierte en un DataFrame de pandas
    de forma robusta.
    - Para CSVs, intenta múltiples separadores y codificaciones.
    - **CRÍTICO**: Lee todas las columnas de CSV y Excel como string (dtype=str)
      para evitar pérdida de datos (ej: ceros a la izquierda en IDs, números
      que podrían interpretarse como flotantes incorrectamente).
    - Lanza un ValueError si el formato no es soportado o el archivo no se puede leer.
    """
    try:
        # Obtenemos el nombre del archivo para mensajes de error más claros
        filename = getattr(file_storage, 'filename', 'unknown_file')
        
        # Obtenemos la extensión para determinar el tipo de archivo
        ext = os.path.splitext(filename)[1].lower().lstrip('.') # '.csv' -> 'csv'
        
        df = None

        if ext == 'csv':
            # Es crucial resetear el puntero del stream (del archivo recibido)
            # antes de cada intento de lectura.
            file_storage.seek(0)
            try:
                # Intento 1: Separador ';' y codificación 'latin1' (común en algunos sistemas)
                # LA CORRECCIÓN CLAVE ESTÁ AQUÍ: dtype=str asegura que TODAS las columnas se lean como texto.
                df = pd.read_csv(file_storage, sep=';', encoding='latin1', dtype=str, keep_default_na=False)
                print(f"  [INFO] Lectura CSV exitosa: sep=';', encoding='latin1', dtype=str.")
            except Exception:
                file_storage.seek(0) # Siempre resetear
                try:
                    # Intento 2: Separador ',' y codificación 'latin1'
                    df = pd.read_csv(file_storage, sep=',', encoding='latin1', dtype=str, keep_default_na=False)
                    print(f"  [INFO] Lectura CSV exitosa: sep=',', encoding='latin1', dtype=str.")
                except Exception:
                    file_storage.seek(0) # Siempre resetear
                    try:
                        # Intento 3: Separador ',' y codificación 'utf-8' (estándar)
                        df = pd.read_csv(file_storage, sep=',', encoding='utf-8', dtype=str, keep_default_na=False)
                        print(f"  [INFO] Lectura CSV exitosa: sep=',', encoding='utf-8', dtype=str.")
                    except Exception as e:
                         # Si todos los intentos fallan, lanzamos un error
                         raise ValueError(f"No se pudo leer el archivo CSV '{filename}' con ninguna configuración probada. Error final: {str(e)}")

        elif ext in ['xlsx', 'xls']:
            file_storage.seek(0)
            # Para Excel, también forzamos todo a string (dtype=str).
            # Esto es importante para mantener la consistencia de datos.
            df = pd.read_excel(file_storage, dtype=str)
            print(f"  [INFO] Lectura Excel exitosa: dtype=str.")
        
        else:
            # Si la extensión no es CSV ni Excel, lanzamos un error.
            raise ValueError(f"Formato de archivo no soportado: '{ext}'. Solo se aceptan CSV y Excel.")
        
        # Si la lectura fue exitosa, devolvemos el DataFrame.
        # Si dtype=str se usó, los NaN en columnas de texto se habrán convertido a 'NA' (o handled by keep_default_na=False).
        # Pero el .where(pd.notnull(df), None) aún podría ser útil si alguna columna no se leyó como string.
        # Lo dejamos por robustez, aunque la intención es que todos los datos sean strings.
        df = df.where(pd.notnull(df), None)
        return df
    
    except Exception as e:
        # Re-lanzamos el error con un mensaje más descriptivo, incluyendo el nombre del archivo.
        raise ValueError(f"Error al procesar el archivo '{filename}': {str(e)}") # type: ignore