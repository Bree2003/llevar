from datetime import datetime
from flask import Blueprint, request, jsonify
from app.config import Config
from app.services import storage_service, logging_service, bq_service
from app.utils.gcp_utils import get_project_id_for_bucket
from app.utils.file_processing import read_file_to_dataframe
from app.utils.file_converter import dataframe_to_parquet_tempfile
from app.utils.bq_mapping import resolve_bq_coordinates
from app.utils.exceptions import InvalidUsage
import pandas as pd
import numpy as np
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
            bucket=bucket_name,
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
    Analiza un archivo en varios pasos.
    """
    if "file" not in request.files:
        raise InvalidUsage(
            "No se proporcionó ningún archivo.", status_code=400)

    file = request.files["file"]
    step = request.form.get("step", "1")

    if not file.filename:
        raise InvalidUsage(
            "El archivo enviado no tiene nombre.", status_code=400)

    # --- FUNCIÓN DE LIMPIEZA UNIFICADA ---
    def clean_col_name(col_name):
        if not col_name:
            return ""
        c = str(col_name).lower()
        c = c.replace('ñ', 'ni')
        c = c.replace(' ', '_')
        replacements = (("á", "a"), ("é", "e"), ("í", "i"),
                        ("ó", "o"), ("ú", "u"), ("ü", "u"))
        for old, new in replacements:
            c = c.replace(old, new)
        return c.strip()

    try:
        # 1. Leemos el archivo
        df = read_file_to_dataframe(file)

        # ==============================================================================
        # LIMPIEZA GLOBAL DE COLUMNAS (Para Paso 2 y Paso 3)
        # ==============================================================================
        if step != "1":
            df.columns = [clean_col_name(col) for col in df.columns]
        # ==============================================================================

        # --- PASO 1: Metadata ---
        if step == "1":
            file.seek(0)
            # Dividimos por (1024 * 1024) para obtener MB
            tamano = round(len(file.read()) / (1024 * 1024), 2)

            metadata = {
                "nombre_archivo": file.filename,
                "tamano": f"{tamano} MB",
                "tipo_archivo": file.filename.split('.')[-1].upper(),
                "fecha_de_carga": pd.Timestamp.now().strftime('%d-%m-%Y'),
                "hora_de_carga": pd.Timestamp.now().strftime('%H:%M horas'),
            }
            return jsonify(metadata)

        # --- PASO 2: Estructura y Previsualización ---
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

        # --- PASO 3: Validación contra BigQuery ---
        elif step == "3":
            env_id = request.form.get('env_id')
            bucket_name = request.form.get('bucket_name')
            destination = request.form.get('destination', "")

            if not all([env_id, bucket_name, destination]):
                return jsonify({
                    "bloqueantes": [],
                    "alertas": ["No se pudo validar: Faltan parámetros."]
                })

            try:
                project_id = get_project_id_for_bucket(env_id, bucket_name)
                parts = destination.split('/')
                if len(parts) < 2:
                    return jsonify({"bloqueantes": [], "alertas": ["Ruta de destino inválida."]})

                product_name = parts[0]
                table_name = parts[1]

                bq_project, bq_dataset, bq_table, bq_bucket = resolve_bq_coordinates(
                    project_id, product_name, table_name, bucket_name)

                target_dataset = ""
                target_table_name = ""

                if env_id == 'sap':
                    try:
                        partes = bq_bucket.split('_')
                        modulo = partes[3]
                        target_dataset = f"sdp_{modulo}_ddo"
                        target_table_name = f"tbl_{bq_table}"
                    except IndexError:
                        return jsonify({"bloqueantes": ["Error formato bucket SAP."], "alertas": []})
                elif env_id == 'pd':
                    target_dataset = f"sdp_{bq_dataset}"
                    target_table_name = f"tbl_{bq_table}"
                else:
                    return jsonify({"bloqueantes": [f"Entorno '{env_id}' no configurado."], "alertas": []})

                # 1. Obtenemos el esquema ORIGINAL de BigQuery
                bq_schema_original = bq_service.get_table_schema(
                    bq_project, target_dataset, target_table_name)

                # Validaciones de seguridad sobre la respuesta
                if isinstance(bq_schema_original, str):
                    return jsonify({"bloqueantes": [], "alertas": [f"BigQuery respondió: {bq_schema_original}"]})
                if bq_schema_original is None:
                    return jsonify({"bloqueantes": [], "alertas": ["No se encontró el esquema en BigQuery."]})

                # 2. PREPARAR ESQUEMA DE VALIDACIÓN (COMO DICCIONARIO)
                # CAMBIO IMPORTANTE: Usamos un Diccionario {} en lugar de Lista []
                validation_schema = {}
                cols_to_ignore = {'year', 'month', 'day'}

                for field in bq_schema_original:
                    original_name = ""
                    f_dict = {}

                    # Extracción segura
                    if hasattr(field, 'name'):  # Es objeto SchemaField
                        original_name = field.name
                        f_dict = field.to_api_repr() if hasattr(
                            field, 'to_api_repr') else field.__dict__.copy()
                    elif isinstance(field, dict):  # Es Dict
                        original_name = field.get('name', '')
                        f_dict = field
                    elif isinstance(field, str):  # Es String
                        original_name = field
                        f_dict = {'name': field,
                                  'type': 'STRING', 'mode': 'NULLABLE'}

                    if not original_name:
                        continue

                    # Ignorar columnas de partición
                    if original_name.lower() in cols_to_ignore:
                        continue

                    # Limpiar nombre
                    clean_name = clean_col_name(original_name)
                    # Actualizamos el nombre dentro del objeto también
                    f_dict['name'] = clean_name

                    # Agregamos al diccionario usando el nombre limpio como Clave
                    validation_schema[clean_name] = f_dict

                # 3. VALIDACIÓN MANUAL DE ESTRUCTURA (BLOQUEANTE)
                bloqueantes = []
                alertas = []

                df_cols = set(df.columns)
                # Ahora obtenemos las claves del diccionario
                bq_cols = set(validation_schema.keys())

                extra_cols = df_cols - bq_cols
                if extra_cols:
                    bloqueantes.append(
                        f"El archivo contiene columnas que no existen en BigQuery: {', '.join(extra_cols)}")

                missing_cols = bq_cols - df_cols
                if missing_cols:
                    bloqueantes.append(
                        f"Faltan columnas requeridas por el esquema de BigQuery: {', '.join(missing_cols)}")

                # 4. LLAMAR AL SERVICIO
                if not bloqueantes:
                    # El servicio probablemente hace 'for col, props in schema.items()'
                    # Ahora 'validation_schema' es un dict, así que funcionará.
                    svc_errores, svc_alertas = bq_service.validate_dataframe_against_schema(
                        df, validation_schema)
                    bloqueantes.extend(svc_errores)
                    alertas.extend(svc_alertas)

                return jsonify({
                    "validado_contra": f"{bq_project}.{bq_dataset}.{bq_table}",
                    "bloqueantes": bloqueantes,
                    "alertas": alertas
                })

            except Exception as e:
                print(f"Error en validación BQ: {e}")
                import traceback
                traceback.print_exc()  # Esto te ayudará a ver exactamente dónde falla en consola
                return jsonify({
                    "bloqueantes": [],
                    "alertas": [f"Advertencia: Excepción al validar BigQuery ({str(e)})"]
                })

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
    print(env_id, bucket_name)
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


# --- MODIFICACIÓN DE LA RUTA EXISTENTE (READ) ---
@storage_bp.route("/products/<path:product_path>/preview-latest", methods=["GET"])
def get_latest_dataset_preview_api(product_path):
    """
    Obtiene el contenido COMPLETO del dataset más reciente para cargarlo en la grilla.
    """
    env_id = request.args.get('env_id')
    bucket_name = request.args.get('bucket_name')

    if not all([env_id, bucket_name]):
        raise InvalidUsage("Faltan parámetros.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)

        # Usamos la función modificada que trae TODO
        filename, df = storage_service.read_latest_dataset_content(
            project_id, bucket_name, product_path)

        if filename is None:
            return jsonify({"exists": False, "message": "No se encontraron archivos."})

        if df is None:
            return jsonify({"exists": True, "fileName": filename, "error": "Formato ilegible."})

        # --- PREPARACIÓN DE DATOS MASIVOS ---

        # 1. Obtener columnas y tipos
        def map_dtype(dtype):
            if pd.api.types.is_numeric_dtype(dtype):
                return "Number"
            if pd.api.types.is_datetime64_any_dtype(dtype):
                return "Date"
            return "Text"

        columnas = [{"nombre": col, "tipo": map_dtype(
            dtype)} for col, dtype in df.dtypes.items()]

        # 2. Convertir DataFrame completo a Diccionario
        # IMPORTANTE: Reemplazar NaN por None es crucial para JSON válido
        # orient='records' crea una lista de objetos: [{col1: val1}, {col1: val2}...]
        full_data = df.replace({np.nan: None}).to_dict(orient='records')

        return jsonify({
            "exists": True,
            "fileName": filename,
            # Lista simple de nombres
            "columns": [c['nombre'] for c in columnas],
            "rows": full_data,                          # TODAS las filas
            "total_registros": len(df)
        })

    except InvalidUsage as e:
        raise e
    except Exception as e:
        # Importante loguear errores de memoria si el archivo es gigante
        print(e)
        raise InvalidUsage(
            f"Error al leer dataset completo: {e}", status_code=500)


# --- NUEVA RUTA (WRITE) ---
@storage_bp.route("/products/save-data", methods=["POST"])
def save_full_data_api():
    """
    Recibe el dataset completo desde el frontend y crea una nueva versión en GCS.
    """
    data = request.get_json()

    # Validaciones básicas
    if not data:
        raise InvalidUsage("No payload received.", status_code=400)

    required = ['env_id', 'bucket_name', 'product_name', 'table_name', 'rows']
    if not all(k in data for k in required):
        raise InvalidUsage(f"Faltan campos: {required}", status_code=400)

    try:
        env_id = data['env_id']
        bucket_name = data['bucket_name']
        product_name = data['product_name']
        table_name = data['table_name']
        rows = data['rows']  # Esta es la lista GIGANTE de diccionarios
        user = data.get('user', 'anonymous')

        project_id = get_project_id_for_bucket(env_id, bucket_name)
        product_path = f"{product_name}/{table_name}"

        # Llamamos al servicio de guardado
        gcs_path = storage_service.save_full_dataset(
            project_id, bucket_name, product_path, rows
        )

        # Logging
        logging_service.log_info(
            "Dataset completo actualizado manualmente",
            user=user,
            product=product_name,
            dataset=table_name,
            bucket=bucket_name,
            gcs_path=gcs_path,
            rows_count=len(rows)
        )

        return jsonify({
            "success": True,
            "message": "Archivo actualizado correctamente.",
            "path": gcs_path
        })

    except Exception as e:
        logging_service.log_error(
            "Error saving data", user=data.get('user'), error=str(e))
        raise InvalidUsage(f"Error guardando datos: {e}", status_code=500)
