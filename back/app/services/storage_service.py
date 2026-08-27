from app.core.gcp import get_storage_client
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from app.services.logging_service import log_info, log_warning, log_error
from app.utils.file_converter import dataframe_to_parquet_tempfile
from dotenv import load_dotenv
import pandas as pd
import io
import os
import polars as pl
import re
import gcsfs
from google.cloud import storage
import tempfile

# ruta base del proyecto
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv(os.path.join(basedir, '.env'))
ENV = os.environ.get("ENV", "dev")

VERSIONED_CASES = {
    "manual/maestro-insumo-actualizar": {
        "source_path": "pd-mermas/tbl-maestro-insumo-actualizar",
        "dest_path": "manual/maestro-insumo-actualizar",
    },
    "manual/maestro-fert-prog-actualizar": {
        "source_path": "pd-programa-fabricacion/tbl-fert-actualizar",
        "dest_path": "manual/maestro-fert-prog-actualizar",
    },
    "manual/maestro-fert-notif-actualizar": {
        "source_path": "pd-notificaciones/tbl-fert-actualizar",
        "dest_path": "manual/maestro-fert-notif-actualizar",
    }
}


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
        folder_name = p.split("/")[1]
        # Quitamos el prefijo que ya conocemos y el slash final
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

import io
import os
import re
import pandas as pd
import polars as pl
import gcsfs

from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from google.cloud import storage


def _read_blob_content(blob):
    """
    Lee el contenido del blob según su extensión y retorna (filename, df).
    """
    filename = blob.name.split("/")[-1]
    data_bytes = blob.download_as_bytes()

    try:
        if filename.endswith(".parquet"):
            df = pd.read_parquet(io.BytesIO(data_bytes))

        elif filename.endswith(".csv"):
            try:
                df = pd.read_csv(
                    io.BytesIO(data_bytes),
                    sep=None,
                    engine="python",
                    encoding="utf-8",
                    on_bad_lines="skip",
                    dtype=str
                )
            except UnicodeDecodeError:
                df = pd.read_csv(
                    io.BytesIO(data_bytes),
                    sep=None,
                    engine="python",
                    encoding="latin-1",
                    on_bad_lines="skip",
                    dtype=str
                )

        elif filename.endswith(".xlsx"):
            df = pd.read_excel(
                io.BytesIO(data_bytes),
                dtype=str,
                engine="calamine"
            )

        else:
            return filename, None

        return filename, df

    except Exception as e:
        print(f"Error leyendo archivo {filename}: {e}")
        return filename, None


def read_latest_dataset_content(project_id, bucket_name, product_path):
    """
    Regla general:
    - Trae el último archivo ingestado en la ruta.

    Regla especial:
    - Para tablas definidas en VERSIONED_CASES:
        * reutiliza el archivo versionado del día si corresponde
        * genera nuevo solo si no existe hoy o si cambió la versión del source
    """

    TARGET_BUCKET = f"raw-{ENV}-ddo-pp-bucket"

    case_config = VERSIONED_CASES.get(product_path)

    if (
        bucket_name == TARGET_BUCKET
        and case_config
    ):
        return aux_case_versionado(case_config)

    storage_client = get_storage_client(project_id)

    bucket = storage_client.bucket(bucket_name)

    blobs_iterator = bucket.list_blobs(
        prefix=f"{product_path}/"
    )

    all_files = [
        blob
        for blob in blobs_iterator
        if not blob.name.endswith("/")
    ]

    if not all_files:
        return None, None

    latest_blob = max(
        all_files,
        key=lambda blob: blob.time_created
    )

    return _read_blob_content(latest_blob)

def aux_case_versionado(case_config):
    storage_client = storage.Client()
    tz = ZoneInfo("America/Santiago")
    today = datetime.now(tz).date()

    SOURCE_BUCKET = f"raw-{ENV}-osc-cdp-bucket"
    DEST_BUCKET = f"raw-{ENV}-ddo-pp-bucket"

    SOURCE_PATH = case_config["source_path"]
    DEST_PATH = case_config["dest_path"]

    def extract_source_ts_str(filename):
        match = re.search(r"src_(\d{8}T\d{6})", filename)
        return match.group(1) if match else None

    source_bucket = storage_client.bucket(SOURCE_BUCKET)

    source_blobs = list(
        source_bucket.list_blobs(prefix=SOURCE_PATH)
    )

    source_files = [
        b
        for b in source_blobs
        if not b.name.endswith("/")
        and b.name.endswith(".parquet")
    ]

    if not source_files:
        return None, None

    latest_source_blob = max(
        source_files,
        key=lambda b: b.time_created
    )

    latest_source_date = (
        latest_source_blob.time_created
        .astimezone(tz)
        .date()
    )

    parquet_files_from_latest_day = [
        b
        for b in source_files
        if b.time_created.astimezone(tz).date()
        == latest_source_date
    ]

    if not parquet_files_from_latest_day:
        return None, None

    latest_source_time = (
        latest_source_blob.time_created
        .astimezone(timezone.utc)
        .replace(
            tzinfo=None,
            microsecond=0
        )
    )

    source_ts_str = latest_source_time.strftime(
        "%Y%m%dT%H%M%S"
    )

    expected_filename = (
        f"data__src_{source_ts_str}.parquet"
    )

    dest_bucket = storage_client.bucket(
        DEST_BUCKET
    )

    dest_blobs = list(
        dest_bucket.list_blobs(
            prefix=f"{DEST_PATH}/"
        )
    )

    dest_today = [
        b
        for b in dest_blobs
        if (
            not b.name.endswith("/")
            and b.name.endswith(".parquet")
            and b.time_created.astimezone(tz).date()
            == today
        )
    ]

    same_version_today = []

    for blob in dest_today:
        filename = blob.name.split("/")[-1]

        if (
            extract_source_ts_str(filename)
            == source_ts_str
        ):
            same_version_today.append(blob)

    if same_version_today:
        latest_dest = max(
            same_version_today,
            key=lambda b: b.time_created
        )

        log_info(
            "ARCHIVO ENCONTRADO",
            file=latest_dest.name,
            source_ts=source_ts_str,
            expected_filename=expected_filename
        )

        return _read_blob_content(latest_dest)

    fs = gcsfs.GCSFileSystem()

    paths = [
        f"gs://{SOURCE_BUCKET}/{b.name}"
        for b in parquet_files_from_latest_day
    ]

    log_info(
        "ARCHIVO NO EXISTE PARA ESTA VERSION. SE GENERA NUEVO MERGE.",
        source_path=SOURCE_PATH,
        dest_path=DEST_PATH,
        source_ts=source_ts_str,
        files_count=len(paths)
    )

    return merge_sharded_parquet_files(
        fs=fs,
        paths=paths,
        source_ts_str=source_ts_str,
        dest_path=DEST_PATH
    )

def merge_sharded_parquet_files(
    fs,
    paths,
    source_ts_str,
    dest_path
):
    tz = ZoneInfo("America/Santiago")
    now = datetime.now(tz)

    partition_path = (
        f"year={now:%Y}/"
        f"month={now:%m}/"
        f"day={now:%d}"
    )

    DEST_BUCKET_NAME = f"raw-{ENV}-ddo-pp-bucket"

    filename = f"data__src_{source_ts_str}.parquet"

    full_output_path = (
        f"gs://{DEST_BUCKET_NAME}/"
        f"{dest_path}/{partition_path}/{filename}"
    )

    try:
        combined_df = pl.scan_parquet(paths).collect()

        with fs.open(full_output_path, "wb") as f:
            combined_df.write_parquet(f)

        return filename, combined_df.to_pandas()

    except Exception:
        dfs = []

        for p in paths:
            with fs.open(p, "rb") as f:
                dfs.append(pl.read_parquet(f))

        combined_df = pl.concat(dfs)

        with fs.open(full_output_path, "wb") as f:
            combined_df.write_parquet(f)

        return filename, combined_df.to_pandas()


def save_full_dataset(project_id, bucket_name, product_path, rows, filename=None):
    """
    Recibe las filas, agrega columnas de partición (year, month, day),
    convierte a Parquet y sube a GCS.

    Para cualquier tabla definida en VERSIONED_CASES:
    - obliga a mantener el nombre versionado (__src_).

    Para el resto:
    - usa data.parquet por defecto.
    """

    tz = ZoneInfo("America/Santiago")
    today = datetime.now(tz)

    year = today.strftime("%Y")
    month = today.strftime("%m")
    day = today.strftime("%d")

    df = pd.DataFrame(rows)

    df["year"] = year
    df["month"] = month
    df["day"] = day

    TARGET_BUCKET = f"raw-{ENV}-ddo-pp-bucket"

    case_config = VERSIONED_CASES.get(product_path)

    if (
        bucket_name == TARGET_BUCKET
        and case_config
    ):
        if not filename or "__src_" not in filename:
            raise ValueError(
                f"Para '{product_path}' debes guardar usando el filename versionado original."
            )
    else:
        if not filename:
            filename = "data.parquet"

    try:
        temp_parquet_path = dataframe_to_parquet_tempfile(
            df,
            filename
        )
    except Exception as e:
        raise Exception(
            f"Error en la transformación de datos: {e}"
        )

    destination_blob_name = (
        f"{product_path}/year={year}/month={month}/day={day}/{filename}"
    )

    storage_client = get_storage_client(project_id)

    bucket = storage_client.bucket(bucket_name)

    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(temp_parquet_path)

    if os.path.exists(temp_parquet_path):
        os.remove(temp_parquet_path)

    return destination_blob_name

def dataframe_to_excel_tempfile(df, filename: str):
    """
    Convierte un DataFrame a un archivo Excel temporal.
    Devuelve la ruta del archivo generado.
    """
    try:
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
        temp_path = temp_file.name
        temp_file.close()

        with pd.ExcelWriter(temp_path, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False)

        return temp_path

    except Exception as e:
        raise Exception(f"Error generando Excel: {e}")


def _normalize_cdp_product_name(product_name: str) -> str:
    """
    Normaliza el nombre del producto de dato para CDP.

    Permite recibir:
    - "mermas"
    - "pd-mermas"

    Retorna:
    - "pd-mermas"
    """
    product_name = product_name.strip().strip("/")

    if product_name.startswith("pd-"):
        return product_name

    return f"pd-{product_name}"


def _safe_excel_sheet_name(name: str, existing_names: set) -> str:
    """
    Limpia y recorta el nombre de una hoja Excel.

    Reglas Excel:
    - máximo 31 caracteres
    - no permite: : \\ / ? * [ ]
    - no puede duplicarse
    """
    safe_name = re.sub(r'[:\\/*?\[\]]', "_", name)
    safe_name = safe_name[:31] or "sheet"

    original = safe_name
    counter = 1

    while safe_name in existing_names:
        suffix = f"_{counter}"
        safe_name = f"{original[:31 - len(suffix)]}{suffix}"
        counter += 1

    existing_names.add(safe_name)
    return safe_name


def _list_direct_subfolders(project_id, bucket_name, path):
    """
    Lista subcarpetas directas dentro de una ruta GCS.

    Ej:
    path = "pd-mermas"

    Retorna:
    [
        "tbl-maestro-insumo-actualizar",
        "tbl-otra-tabla"
    ]
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)

    prefix = f"{path.strip('/')}/" if path else ""

    blobs_iterator = bucket.list_blobs(prefix=prefix, delimiter="/")
    list(blobs_iterator)

    subfolders = []

    for full_prefix in blobs_iterator.prefixes:
        # full_prefix: "pd-mermas/tbl-x/"
        folder_name = full_prefix[len(prefix):].strip("/")

        if folder_name:
            subfolders.append(folder_name)

    return subfolders


def _get_latest_partition_prefix(project_id, bucket_name, table_path):
    """
    Obtiene la última partición disponible para una tabla.

    Espera rutas tipo:
    pd-mermas/tbl-x/year=2026/month=07/day=13/data.parquet

    Retorna:
    "pd-mermas/tbl-x/year=2026/month=07/day=13"

    o None si no encuentra particiones.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)

    table_path = table_path.strip("/")
    prefix = f"{table_path}/"

    blobs = bucket.list_blobs(prefix=prefix)

    partition_regex = re.compile(
        rf"^{re.escape(table_path)}/year=(\d{{4}})/month=(\d{{2}})/day=(\d{{2}})/"
    )

    partitions = {}

    for blob in blobs:
        if blob.name.endswith("/"):
            continue

        match = partition_regex.match(blob.name)

        if not match:
            continue

        year, month, day = match.groups()
        partition_date = datetime(
            int(year),
            int(month),
            int(day),
            tzinfo=ZoneInfo("America/Santiago")
        ).date()

        partition_prefix = (
            f"{table_path}/year={year}/month={month}/day={day}"
        )

        partitions[partition_date] = partition_prefix

    if not partitions:
        return None

    latest_date = max(partitions.keys())
    return partitions[latest_date]

def _list_direct_subfolders_safe(project_id, bucket_name, path):
    """
    Lista subcarpetas directas dentro de una ruta GCS.

    Ejemplo:
    path = "pd-mermas"

    Retorna:
    [
        "tbl-maestro-insumo-actualizar",
        "tbl-otra-tabla"
    ]
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)

    clean_path = path.strip("/")
    prefix = f"{clean_path}/" if clean_path else ""

    blobs_iterator = bucket.list_blobs(prefix=prefix, delimiter="/")
    list(blobs_iterator)

    subfolders = []

    for full_prefix in blobs_iterator.prefixes:
        # Ejemplo:
        # full_prefix = "pd-mermas/tbl-x/"
        # prefix = "pd-mermas/"
        folder_name = full_prefix[len(prefix):].strip("/")

        if folder_name:
            subfolders.append(folder_name)

    return subfolders

def _get_parquet_paths_from_partition(project_id, bucket_name, partition_prefix):
    """
    Retorna todos los archivos parquet dentro de una partición como rutas gs://.
    """
    storage_client = get_storage_client(project_id)
    bucket = storage_client.bucket(bucket_name)

    clean_partition_prefix = partition_prefix.strip("/")
    blobs = bucket.list_blobs(prefix=f"{clean_partition_prefix}/")

    parquet_paths = [
        f"gs://{bucket_name}/{blob.name}"
        for blob in blobs
        if not blob.name.endswith("/") and blob.name.endswith(".parquet")
    ]

    return parquet_paths


def merge_sharded_parquet_files_to_dataframe(fs, paths):
    """
    Lee y une archivos parquet shardeados desde GCS y retorna un DataFrame pandas.

    Esta función es parecida a merge_sharded_parquet_files, pero no escribe un nuevo
    parquet en GCS. Está pensada para exportar a Excel.
    """
    if not paths:
        return pd.DataFrame()

    try:
        combined_df = pl.scan_parquet(paths).collect()
        return combined_df.to_pandas()

    except Exception as e:
        log_warning(
            "scan_parquet falló. Se usará fallback leyendo archivos uno a uno.",
            error=str(e),
            files_count=len(paths)
        )

        dfs = []

        for path in paths:
            with fs.open(path, "rb") as f:
                dfs.append(pl.read_parquet(f))

        if not dfs:
            return pd.DataFrame()

        combined_df = pl.concat(dfs, how="vertical_relaxed")
        return combined_df.to_pandas()

def merge_sharded_parquet_files_dynamic(fs, paths):
    """
    Merge dinámico de archivos parquet shardeados.

    A diferencia de merge_sharded_parquet_files, esta función no escribe
    obligatoriamente en GCS. Solo retorna el DataFrame unificado.

    Esto sirve perfecto para descargar como Excel.
    """
    if not paths:
        return pd.DataFrame()

    try:
        combined_df = pl.scan_parquet(paths).collect()
        return combined_df.to_pandas()

    except Exception as e:
        log_warning(
            "FALLBACK MERGE: scan_parquet falló, se intentará lectura individual.",
            error=str(e),
            files_count=len(paths)
        )

        dfs = []

        for path in paths:
            with fs.open(path, "rb") as f:
                dfs.append(pl.read_parquet(f))

        combined_df = pl.concat(dfs, how="vertical_relaxed")
        return combined_df.to_pandas()


def cdp_product_latest_partitions_to_excel(project_id, bucket_name, product_name):
    """
    Genera un Excel con la última partición de cada tabla de un producto CDP.

    Ejemplo real:
    bucket_name = "raw-prd-osc-cdp-bucket"
    product_name = "pd-mermas"

    Estructura esperada:
    gs://raw-prd-osc-cdp-bucket/pd-mermas/tbl-merma/year=2026/month=07/day=08/*.parquet

    Retorna:
    - temp_path: ruta local temporal del Excel
    - excel_filename: nombre sugerido para descarga
    """
    product_path = _normalize_cdp_product_name(product_name)

    fs = gcsfs.GCSFileSystem(project=project_id)

    log_info(
        "INICIANDO GENERACIÓN EXCEL CDP",
        project_id=project_id,
        bucket=bucket_name,
        product=product_path
    )

    tables = _list_direct_subfolders(
        project_id=project_id,
        bucket_name=bucket_name,
        path=product_path
    )

    log_info(
        "TABLAS ENCONTRADAS PARA PRODUCTO CDP",
        product=product_path,
        tables=tables,
        tables_count=len(tables)
    )

    if not tables:
        raise ValueError(
            f"No se encontraron tablas dentro del producto de dato: {product_path}"
        )

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
    temp_path = temp_file.name
    temp_file.close()

    sheet_names = set()
    written_sheets = 0

    with pd.ExcelWriter(temp_path, engine="xlsxwriter") as writer:
        for table_name in tables:
            table_path = f"{product_path}/{table_name}"

            latest_partition_prefix = _get_latest_partition_prefix(
                project_id=project_id,
                bucket_name=bucket_name,
                table_path=table_path
            )

            if not latest_partition_prefix:
                log_warning(
                    "TABLA OMITIDA: No tiene particiones year/month/day.",
                    product=product_path,
                    table=table_name,
                    table_path=table_path
                )
                continue

            parquet_paths = _get_parquet_paths_from_partition(
                project_id=project_id,
                bucket_name=bucket_name,
                partition_prefix=latest_partition_prefix
            )

            if not parquet_paths:
                log_warning(
                    "TABLA OMITIDA: La última partición no tiene archivos parquet.",
                    product=product_path,
                    table=table_name,
                    partition=latest_partition_prefix
                )
                continue

            log_info(
                "GENERANDO HOJA EXCEL DESDE ÚLTIMA PARTICIÓN CDP.",
                product=product_path,
                table=table_name,
                partition=latest_partition_prefix,
                files_count=len(parquet_paths)
            )

            df = merge_sharded_parquet_files_to_dataframe(
                fs=fs,
                paths=parquet_paths
            )

            if df.empty:
                log_warning(
                    "TABLA OMITIDA: DataFrame vacío luego del merge.",
                    product=product_path,
                    table=table_name,
                    partition=latest_partition_prefix
                )
                continue

            if len(df) > 1_048_576:
                raise ValueError(
                    f"La tabla '{table_name}' tiene {len(df)} filas y excede el límite de Excel."
                )

            sheet_name = _safe_excel_sheet_name(table_name, sheet_names)

            df.to_excel(
                writer,
                sheet_name=sheet_name,
                index=False
            )

            written_sheets += 1

    if written_sheets == 0:
        if os.path.exists(temp_path):
            os.remove(temp_path)

        raise ValueError(
            f"No se pudo generar el Excel. Ninguna tabla de {product_path} tenía parquet válido en su última partición."
        )

    today = datetime.now(ZoneInfo("America/Santiago")).strftime("%Y%m%d")
    excel_filename = f"{product_path}_latest_partitions_{today}.xlsx"

    log_info(
        "EXCEL CDP GENERADO CORRECTAMENTE",
        product=product_path,
        file_name=excel_filename,
        local_path=temp_path,
        sheets_count=written_sheets
    )

    return temp_path, excel_filename