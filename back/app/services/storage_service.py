from app.core.gcp import get_storage_client
from datetime import datetime, timedelta
import pandas as pd
import io


def list_data_products(project_id, bucket_name):
    """
    Lista las "carpetas" de nivel superior en un bucket de GCS.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)
    # El delimitador agrupa los resultados por "carpetas"
    blobs_iterator = bucket.list_blobs(delimiter="/")

    # Es necesario consumir el iterador para que la propiedad .prefixes se llene
    list(blobs_iterator)

    # blobs_iterator.prefixes contendrá los nombres de las carpetas
    products = [prefix.strip('/') for prefix in blobs_iterator.prefixes]
    return products


def list_datasets_in_product(project_id, bucket_name, product_name):
    """
    Lista los archivos (datasets) dentro de una "carpeta" (Producto de Datos) específica.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)
    # El prefijo asegura que solo busquemos dentro de la carpeta deseada
    prefix = f"{product_name}/"
    blobs = bucket.list_blobs(prefix=prefix)

    # Extraemos solo el nombre del archivo y omitimos la propia "carpeta"
    datasets = [
        blob.name.split('/')[-1] for blob in blobs if not blob.name.endswith('/')
    ]
    return datasets


def list_subfolders_in_path(project_id, bucket_name, path):
    """
    Lista las subcarpetas directas dentro de una 
    ruta (path) específica en un bucket.

    Args:
        env_id (str): El ID del environment en el archivo de configuración.
        bucket_name (str): El nombre del bucket.
        path (str): La ruta de la carpeta a explorar. Ej: "producto/manual".

    Returns:
        list: Una lista de nombres de las subcarpetas directas.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)

    # Nos aseguramos de que el prefijo termine con '/' para buscar DENTRO de la carpeta.
    # Si el path está vacío, buscamos desde la raíz.
    prefix = f"{path}/" if path else ""

    # La clave está aquí: usamos prefix y delimiter juntos.
    # Esto le dice a GCS: "Empieza en esta ruta y agrupa por el siguiente '/'".
    blobs_iterator = bucket.list_blobs(prefix=prefix, delimiter="/")

    # Es necesario consumir el iterador para que la propiedad .prefixes se llene
    list(blobs_iterator)

    # blobs_iterator.prefixes contendrá rutas completas como 'producto/manual/tabla1/'
    # Necesitamos limpiarlas para obtener solo 'tabla1'
    subfolders = []
    for p in blobs_iterator.prefixes:
        # Quitamos el prefijo que ya conocemos y el slash final
        folder_name = p.replace(prefix, "").strip('/')
        subfolders.append(folder_name)

    return subfolders


def get_latest_dataset_in_product(project_id, bucket_name, product_path):
    """
    Encuentra y devuelve el nombre del archivo (dataset) más reciente dentro de una ruta.
    La recencia se determina por la fecha de creación del objeto en GCS.

    Args:
        project_id (str): El ID del proyecto de GCP.
        bucket_name (str): El nombre del bucket.
        product_path (str): La ruta completa de la tabla. Ej: "producto/manual/tabla1".

    Returns:
        str or None: El nombre del archivo más reciente, o None si la carpeta está vacía.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)

    # El prefijo asegura que solo busquemos dentro de la carpeta deseada
    prefix = f"{product_path}/"

    # Obtenemos el iterador de blobs (archivos)
    blobs_iterator = bucket.list_blobs(prefix=prefix)

    # Filtramos para ignorar "carpetas" vacías que terminan en '/'
    all_files = [
        blob for blob in blobs_iterator if not blob.name.endswith('/')]

    # Si no se encontraron archivos, devolvemos None
    if not all_files:
        return None

    # Usamos la función max() de Python con una clave personalizada.
    # Para cada 'blob' en la lista, miramos su atributo 'time_created'.
    # max() encontrará el blob que tenga el valor más alto en ese atributo.
    latest_blob = max(all_files, key=lambda blob: blob.time_created)

    # Extraemos solo el nombre del archivo de la ruta completa (blob.name)
    latest_filename = latest_blob.name.split('/')[-1]

    return latest_filename


def create_resumable_upload_session(project_id, bucket_name, destination_blob_name, origin_url):
    """
    Inicia una sesión de subida reanudable y devuelve la URL de sesión.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # El 'origin' es la URL del frontend, necesario para la verificación CORS.
    url = blob.create_resumable_upload_session(
        origin=origin_url
    )
    return url


def upload_file(project_id, bucket_name, local_path, table_path):
    """
    Sube un archivo a una ruta particionada por fecha (año/mes/día).
    El nombre del archivo final será siempre "data.parquet".

    Args:
        project_id (str): El ID del proyecto de GCP.
        bucket_name (str): El nombre del bucket.
        local_path (str): La ruta al archivo temporal local que se va a subir.
        table_path (str): La ruta base de la tabla. Ej: "sap/stxh".

    Returns:
        str: La ruta completa del blob creado en GCS.
    """
    # 1. Obtener la fecha actual en UTC para evitar problemas de zona horaria.
    today = datetime.now()

    # 2. Formatear las partes de la fecha con cero a la izquierda donde sea necesario.
    # %Y -> 2025, %m -> 11, %d -> 08
    year = today.strftime('%Y')
    month = today.strftime('%m')
    day = today.strftime('%d')

    # 3. Definir el nombre de archivo fijo.
    filename = "data.parquet"

    # 4. Construir la ruta final del blob con el particionamiento.
    destination_blob_name = f"{table_path}/year={year}/month={month}/day={day}/{filename}"

    # 5. Subir el archivo como antes.
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(local_path)

    # 6. Devolver la ruta completa del archivo creado.
    return destination_blob_name


def read_latest_dataset_preview(project_id, bucket_name, product_path, rows=20):
    """
    Busca el archivo más reciente, lee su contenido (Parquet, CSV o Excel) 
    y devuelve un DataFrame con las primeras N filas.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)

    # 1. Reutilizamos la lógica para encontrar el blob más reciente
    prefix = f"{product_path}/"
    blobs_iterator = bucket.list_blobs(prefix=prefix)
    all_files = [
        blob for blob in blobs_iterator if not blob.name.endswith('/')]

    if not all_files:
        return None, None  # No file found

    # Encontramos el objeto blob completo más reciente
    latest_blob = max(all_files, key=lambda blob: blob.time_created)
    filename = latest_blob.name.split('/')[-1]

    # 2. Descargamos el archivo a memoria (sin guardar en disco)
    data_bytes = latest_blob.download_as_bytes()

    # 3. Leemos según la extensión
    try:
        if filename.endswith('.parquet'):
            df = pd.read_parquet(io.BytesIO(data_bytes))

        elif filename.endswith('.csv'):
            # --- LOGICA ROBUSTA PARA CSV ---
            # Usamos BytesIO(data_bytes) en cada intento porque el stream se consume
            try:
                # Intento 1: UTF-8 y auto-detección de separador (, o ;)
                df = pd.read_csv(
                    io.BytesIO(data_bytes),
                    sep=None,
                    engine='python',
                    encoding='utf-8',
                    on_bad_lines='skip'
                )
            except UnicodeDecodeError:
                # Intento 2: Latin-1 (común en archivos con tildes/ñ de Excel)
                df = pd.read_csv(
                    io.BytesIO(data_bytes),
                    sep=None,
                    engine='python',
                    encoding='latin-1',
                    on_bad_lines='skip'
                )

        elif filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(data_bytes))
        else:
            # Extensión no soportada
            return filename, None

        # 4. Retornamos nombre y las primeras filas
        return filename, df.head(rows)

    except Exception as e:
        print(f"Error leyendo archivo {filename}: {e}")
        return filename, None
