from datetime import datetime
from flask import Blueprint, request, jsonify, send_file
from app.config import Config
from app.services import storage_service, logging_service
from app.utils.gcp_utils import get_project_id_for_bucket
from app.utils.file_processing import read_file_to_dataframe
from app.utils.file_converter import dataframe_to_parquet_tempfile
from app.utils.exceptions import InvalidUsage
import pandas as pd
import numpy as np
import io
import os

storage_bp = Blueprint("storage", __name__)


@storage_bp.route("/environments", methods=["GET"])
def get_environments():
    """
    Devuelve la lista de entornos configurados para que el frontend pueda
    poblar selectores. Esta es la única ruta que no necesita validación.
    """
    return jsonify(Config.GCP_ENVIRONMENTS)


@storage_bp.route("/products", methods=["GET"])
def list_data_products_api():
    """
    Lista los productos de datos (carpetas raíz) en un bucket.
    """
    env_id = request.args.get('env_id')
    bucket_name = request.args.get('bucket_name')
    if not all([env_id, bucket_name]):
        raise InvalidUsage(
            "Los parámetros 'env_id' y 'bucket_name' son requeridos.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)
        products = storage_service.list_data_products(project_id, bucket_name)
        return jsonify({"data_products": products})
    except InvalidUsage as e:
        raise e  # Propagar errores de validación
    except Exception as e:
        raise InvalidUsage(f"Error al listar productos: {e}", status_code=500)


@storage_bp.route("/folders/<path:folder_path>", methods=["GET"])
def list_subfolders_api(folder_path):
    """
    Lista las subcarpetas (tablas) dentro de una ruta específica.
    """
    env_id = request.args.get('env_id')
    bucket_name = request.args.get('bucket_name')
    if not all([env_id, bucket_name]):
        raise InvalidUsage(
            "Los parámetros 'env_id' y 'bucket_name' son requeridos.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)
        subfolders = storage_service.list_subfolders_in_path(
            project_id, bucket_name, folder_path)
        return jsonify({"tables": subfolders})
    except InvalidUsage as e:
        raise e
    except Exception as e:
        raise InvalidUsage(
            f"Error al listar subcarpetas para la ruta '{folder_path}': {e}", status_code=500)


@storage_bp.route("/products/<path:product_path>/latest-dataset", methods=["GET"])
def get_latest_dataset_api(product_path):
    """
    Obtiene el nombre del dataset más reciente dentro de una ruta de producto/tabla.
    """
    env_id = request.args.get('env_id')
    bucket_name = request.args.get('bucket_name')
    if not all([env_id, bucket_name]):
        raise InvalidUsage(
            "Los parámetros 'env_id' y 'bucket_name' son requeridos.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)
        latest_dataset = storage_service.get_latest_dataset_in_product(
            project_id, bucket_name, product_path)
        return jsonify({"latest_dataset": latest_dataset})
    except InvalidUsage as e:
        raise e
    except Exception as e:
        raise InvalidUsage(
            f"Error al obtener el último dataset para '{product_path}': {e}", status_code=500)


@storage_bp.route("/initiate-resumable-upload", methods=["POST"])
def initiate_resumable_upload_api():
    data = request.get_json()
    if not data or not all(k in data for k in ['env_id', 'bucket_name', 'destination', 'fileName']):
        raise InvalidUsage("Faltan parámetros requeridos.", status_code=400)

    env_id = data['env_id']
    bucket_name = data['bucket_name']
    table_path = data['destination']
    file_name = data['fileName']
    user = "anonymous"  # Puedes obtener esto de una cabecera de autenticación

    # La cabecera 'Origin' es enviada por el navegador y es necesaria para CORS
    origin_url = request.headers.get('Origin')
    if not origin_url:
        raise InvalidUsage(
            "La cabecera 'Origin' es requerida.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)

        # Construimos la ruta final particionada con el nombre del archivo original
        today = datetime.now()
        year, month, day = today.strftime(
            '%Y'), today.strftime('%m'), today.strftime('%d')
        final_blob_path = f"{table_path}/year={year}/month={month}/day={day}/{file_name}"

        # Llamamos al servicio para obtener la URL de sesión
        session_url = storage_service.create_resumable_upload_session(
            project_id,
            bucket_name,
            final_blob_path,
            origin_url
        )

        # 1. Extraemos 'product' y 'dataset' de la variable 'table_path'
        path_parts = table_path.split('/')
        product = path_parts[0] if len(path_parts) > 0 else None
        dataset = path_parts[1] if len(path_parts) > 1 else None

        # 2. Llamamos al servicio de logging con los nuevos campos
        logging_service.log_info(
            "Sesión de subida reanudable iniciada",
            user=user,
            product=product,         # <--- CAMPO AÑADIDO
            dataset=dataset,         # <--- CAMPO AÑADIDO
            file_name=file_name,     # Usamos el nombre original del archivo
            gcs_path=final_blob_path  # Guardamos la ruta completa también
        )

        # Devolvemos la URL de sesión al frontend
        return jsonify({
            "sessionUrl": session_url,
            "finalPath": final_blob_path
        })

    except InvalidUsage as e:
        raise e
    except Exception as e:
        logging_service.log_error(
            "Fallo al iniciar sesión de subida", user=user, error=str(e))
        raise InvalidUsage(f"Error al iniciar la subida: {e}", status_code=500)


@storage_bp.route("/analyze", methods=["POST"])
def analyze_file_api():
    """
    Analiza un archivo en varios pasos sin subirlo a GCS.
    Esta ruta no necesita validación de entorno ya que no interactúa con GCS.
    """
    if "file" not in request.files:
        raise InvalidUsage(
            "No se proporcionó ningún archivo.", status_code=400)

    file = request.files["file"]
    step = request.form.get("step", "1")

    if not file.filename:
        raise InvalidUsage(
            "El archivo enviado no tiene nombre.", status_code=400)

    try:
        df = read_file_to_dataframe(file)

        if step == "1":
            file.seek(0)
            tamano = round(len(file.read()) / 1024, 2)
            metadata = {
                "nombre_archivo": file.filename,
                "tamano": f"{tamano} KB",
                "tipo_archivo": file.filename.split('.')[-1].upper(),
                "fecha_de_carga": pd.Timestamp.now().strftime('%d-%m-%Y'),
                "hora_de_carga": pd.Timestamp.now().strftime('%H:%M horas'),
            }
            return jsonify(metadata)
        elif step == "2":
            def map_dtype(dtype):
                if pd.api.types.is_numeric_dtype(dtype):
                    return "Number"
                if pd.api.types.is_datetime64_any_dtype(dtype):
                    return "Date"
                return "Text"

            columnas = [{"nombre": col, "tipo": map_dtype(
                dtype)} for col, dtype in df.dtypes.items()]
            vista_previa = df.head(5).replace(
                {np.nan: None}).to_dict(orient='records')
            structure_data = {
                "numero_columnas": len(df.columns),
                "numero_registros": len(df),
                "columnas_encontradas": columnas,
                "vista_previa": vista_previa
            }
            return jsonify(structure_data)
        elif step == "3":
            alerts = []
            if 'columna_esperada' not in df.columns:
                alerts.append(
                    "Alerta: La columna 'columna_esperada' no se encontró.")
            return jsonify({"alertas": alerts})
        else:
            raise InvalidUsage(f"Paso desconocido: {step}", status_code=400)
    except (ValueError, Exception) as e:
        raise InvalidUsage(str(e))


@storage_bp.route("/upload", methods=["POST"])
def upload_file_api():
    if "file" not in request.files:
        raise InvalidUsage(
            "No se proporcionó ningún archivo.", status_code=400)

    env_id = request.form.get('env_id')
    bucket_name = request.form.get('bucket_name')
    # 'destination' ahora es la ruta de la tabla, ej: "sap/stxh"
    destination = request.form.get("destination")
    user = request.form.get("user", "anonymous")

    if not all([env_id, bucket_name, destination]):
        raise InvalidUsage(
            "Los campos 'env_id', 'bucket_name' y 'destination' son requeridos.", status_code=400)

    file = request.files["file"]
    if not file.filename:
        raise InvalidUsage(
            "El archivo enviado no tiene nombre.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)

        df = read_file_to_dataframe(file)

        parquet_path = dataframe_to_parquet_tempfile(df, file.filename)

        final_blob_path = storage_service.upload_file(
            project_id, bucket_name, parquet_path, destination)
        os.remove(parquet_path)

        # 1. Extraemos 'product' y 'dataset' de la variable 'destination'
        path_parts = destination.split('/') if destination else []
        product = path_parts[0] if len(path_parts) > 0 else None
        dataset = path_parts[1] if len(path_parts) > 1 else None

        # 2. Llamamos al servicio de logging con los nuevos campos extraídos
        logging_service.log_info(
            "Archivo subido exitosamente",
            user=user,
            env_id=env_id,
            bucket=bucket_name,
            file_name=file.filename,  # Usamos el nombre original del archivo
            product=product,         # <--- CAMPO AÑADIDO
            dataset=dataset,         # <--- CAMPO AÑADIDO
            gcs_path=final_blob_path  # También es útil guardar la ruta completa
        )

        msg = f"File {final_blob_path} uploaded to {bucket_name}"
        return jsonify({"message": msg})

    except InvalidUsage as e:
        raise e
    except (ValueError, Exception) as e:
        logging_service.log_error(
            "Fallo al subir el archivo",
            user=user,
            env_id=env_id,
            bucket=bucket_name,
            file_name=file.filename,
            error=str(e)
        )
        raise InvalidUsage(str(e))


@storage_bp.route("/products/<path:product_path>/preview-latest", methods=["GET"])
def get_latest_dataset_preview_api(product_path):
    """
    Obtiene el contenido (vista previa) del dataset más reciente.
    """
    env_id = request.args.get('env_id')
    bucket_name = request.args.get('bucket_name')

    if not all([env_id, bucket_name]):
        raise InvalidUsage(
            "Los parámetros 'env_id' y 'bucket_name' son requeridos.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)

        # Llamamos al nuevo servicio
        filename, df = storage_service.read_latest_dataset_preview(
            project_id, bucket_name, product_path)

        if filename is None:
            return jsonify({"exists": False, "message": "No se encontraron archivos."})

        if df is None:
            return jsonify({
                "exists": True,
                "fileName": filename,
                "error": "No se pudo leer el formato del archivo o está corrupto."
            })

        # Mapeo de tipos de datos (Igual que en tu /analyze)
        def map_dtype(dtype):
            if pd.api.types.is_numeric_dtype(dtype):
                return "Number"
            if pd.api.types.is_datetime64_any_dtype(dtype):
                return "Date"
            return "Text"

        columnas = [{"nombre": col, "tipo": map_dtype(
            dtype)} for col, dtype in df.dtypes.items()]

        # Convertimos NaN a None para que sea JSON válido
        vista_previa = df.replace({np.nan: None}).to_dict(orient='records')

        return jsonify({
            "exists": True,
            "fileName": filename,
            # Lista simple de nombres para la tabla
            "columns": [c['nombre'] for c in columnas],
            "data": vista_previa,
            "total_registros_preview": len(df)
        })

    except InvalidUsage as e:
        raise e
    except Exception as e:
        raise InvalidUsage(f"Error al obtener preview: {e}", status_code=500)
