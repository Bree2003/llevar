from datetime import datetime
from flask import Blueprint, request, jsonify
from app.config import Config
from app.services import storage_service, logging_service, bq_service
from app.utils.gcp_utils import get_project_id_for_bucket
from app.utils.file_processing import read_file_to_dataframe
from app.utils.file_converter import dataframe_to_parquet_tempfile
from app.utils.bq_mapping import resolve_bq_coordinates
from app.utils.get_schema_gcs import get_schema_from_gcs_csv
from app.utils.exceptions import InvalidUsage
from app.utils.file_converter import clean_col_name
import pandas as pd
import numpy as np
import os
import json
import re
import unicodedata
from flask import send_file

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
    user = "anonymous"

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
            product=product,       
            dataset=dataset,         
            bucket=bucket_name,
            file_name=file_name,   
            gcs_path=final_blob_path
        )

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

@storage_bp.route("/process-cuadratura-upload", methods=["POST"])
def process_cuadratura_upload():
    data = request.get_json()

    required = ["env_id", "bucket_name", "destination", "fileName"]
    if not data or not all(k in data for k in required):
        raise InvalidUsage("Faltan parámetros requeridos.", status_code=400)

    env_id = data["env_id"]
    bucket_name = data["bucket_name"]
    destination = data["destination"]
    file_name = data["fileName"]
    user = data.get("user", "anonymous")

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)

        parts = destination.split("/")

        if len(parts) < 2:
            raise InvalidUsage("Destino inválido", status_code=400)

        nombre_tabla = parts[1] 

        blob_path = f"{destination}/{file_name}"

        schema_data, delimiter = get_schema_from_gcs_csv(bucket_name, blob_path)

        table_id = f"tbl_{nombre_tabla.replace('-', '_')}"

        bq_service.create_table_cuadratura_csv(
            project_id=project_id,
            table_id=table_id,
            schema_data=schema_data,
            bucket_name=bucket_name,
            nombre_tabla=nombre_tabla,
            field_delimiter=delimiter
        )

        logging_service.log_info(
            "Tabla de cuadratura creada correctamente",
            user=user,
            table=f"cuadraturas.{table_id}",
            gcs_path=blob_path
        )

        return jsonify({
            "message": "Tabla creada correctamente",
            "bq_table": f"cuadraturas.{table_id}"
        })

    except Exception as e:
        logging_service.log_error(
            "Error procesando cuadratura",
            user=user,
            error=str(e),
            destination=destination
        )
        raise InvalidUsage(f"Error procesando archivo: {str(e)}", status_code=500)

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
    is_new_table = request.form.get('is_new_table') == 'true'

    if not file.filename:
        raise InvalidUsage(
            "El archivo enviado no tiene nombre.", status_code=400)

    try:
        # 1. Leemos el archivo
        df = read_file_to_dataframe(file)

        if step != "1":
            df.columns = [clean_col_name(col) for col in df.columns]

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

            if is_new_table:
                return jsonify({
                    "validado_contra": "N/A (Nueva Tabla)",
                    "bloqueantes": [],
                    "alertas": []
                })

            env_id = request.form.get('env_id')
            bucket_name = request.form.get('bucket_name')
            destination = request.form.get('destination', "")

            if not all([env_id, bucket_name, destination]):
                return jsonify({"bloqueantes": [], "alertas": ["No se pudo validar: Faltan parámetros."]})

            try:
                project_id = get_project_id_for_bucket(env_id, bucket_name)
                parts = destination.split('/')
                if len(parts) < 2:
                    return jsonify({"bloqueantes": [], "alertas": ["Ruta de destino inválida."]})

                product_name = parts[0]
                table_name = parts[1]

                bq_project, bq_dataset, bq_table_base, bq_bucket = resolve_bq_coordinates(
                    project_id, product_name, table_name, bucket_name)

                target_dataset = ""
                
                if env_id == 'sap':
                    try:
                        partes = bq_bucket.split('_')
                        modulo = partes[3] if len(partes) > 3 else "manual"
                        target_dataset = f"sdp_{modulo}_ddo"
                    except IndexError:
                        target_dataset = f"sdp_{product_name}_ddo"
                elif env_id == 'pd':
                    target_dataset = f"sdp_{bq_dataset}"
                else:
                    target_dataset = f"sdp_{product_name.replace('-', '_')}"
                
                table_check_1 = f"tbl_{bq_table_base}"

                bq_schema_original = bq_service.get_table_schema(
                    bq_project, target_dataset, table_check_1)
                
                used_table_name = table_check_1

                # Validaciones de seguridad
                if isinstance(bq_schema_original, str): 
                    return jsonify({"bloqueantes": [], "alertas": [f"BigQuery respondió: {bq_schema_original}"]})
                
                if bq_schema_original is None:
                    return jsonify({
                        "bloqueantes": [], 
                        "alertas": [f"No se encontró la tabla en BigQuery '{table_check_1}'. Se tratará como tabla nueva."]
                    })

                # 2. PREPARAR ESQUEMA DE VALIDACIÓN
                validation_schema = {}
                cols_to_ignore = {'year', 'month', 'day'}

                for field in bq_schema_original:
                    original_name = ""
                    f_dict = {}

                    if hasattr(field, 'name'):
                        original_name = field.name
                        f_dict = field.to_api_repr() if hasattr(field, 'to_api_repr') else field.__dict__.copy()
                    elif isinstance(field, dict):
                        original_name = field.get('name', '')
                        f_dict = field
                    elif isinstance(field, str):
                        original_name = field
                        f_dict = {'name': field, 'type': 'STRING', 'mode': 'NULLABLE'}

                    if not original_name: continue
                    if original_name.lower() in cols_to_ignore: continue

                    clean_name = clean_col_name(original_name)
                    f_dict['name'] = clean_name
                    validation_schema[clean_name] = f_dict

                # 3. VALIDACIÓN
                bloqueantes = []
                alertas = []
                df_cols = set(df.columns)
                bq_cols = set(validation_schema.keys())

                extra_cols = df_cols - bq_cols
                if extra_cols:
                    bloqueantes.append(f"El archivo contiene columnas que no existen en BigQuery: {', '.join(extra_cols)}")

                missing_cols = bq_cols - df_cols
                if missing_cols:
                    bloqueantes.append(f"Faltan columnas requeridas por el esquema de BigQuery: {', '.join(missing_cols)}")

                if not bloqueantes:
                    svc_errores, svc_alertas = bq_service.validate_dataframe_against_schema(df, validation_schema)
                    bloqueantes.extend(svc_errores)
                    alertas.extend(svc_alertas)

                return jsonify({
                    "validado_contra": f"{bq_project}.{target_dataset}.{used_table_name}",
                    "bloqueantes": bloqueantes,
                    "alertas": alertas
                })

            except Exception as e:
                print(f"Error en validación BQ: {e}")
                import traceback
                traceback.print_exc()
                return jsonify({"bloqueantes": [], "alertas": [f"Error interno validando: {str(e)}"]})

        else:
            raise InvalidUsage(f"Paso desconocido: {step}", status_code=400)

    except (ValueError, Exception) as e:
        raise InvalidUsage(str(e))


@storage_bp.route("/upload", methods=["POST"])
def upload_file_api():
    user = request.form.get("user", "anonymous")
    
    if "file" not in request.files:
        logging_service.log_error("No se proporcionó ningún archivo.", user=user)
        raise InvalidUsage(msg, status_code=400)

    env_id = request.form.get('env_id')
    bucket_name = request.form.get('bucket_name')
    destination = request.form.get("destination", "")
    
    metadata_json = request.form.get('metadata')
    schema_json = request.form.get('schema')

    if not all([env_id, bucket_name, destination]):
        msg = "Faltan campos 'env_id', 'bucket_name' y 'destination'."
        logging_service.log_error(msg, user=user, env_id=env_id, bucket=bucket_name)
        raise InvalidUsage(msg, status_code=400)

    file = request.files["file"]
    if not file.filename:
        logging_service.log_error("El archivo enviado no tiene nombre.", user=user)
        raise InvalidUsage(msg, status_code=400)
    path_parts = destination.split('/') if destination else []
    product = path_parts[0] if len(path_parts) > 0 else None
    dataset = path_parts[1] if len(path_parts) > 1 else None
    try:
        try:
            project_id = get_project_id_for_bucket(env_id, bucket_name)
            parts = destination.split('/')
            if len(parts) < 2:
                raise ValueError("La ruta de destino debe ser 'producto/tabla'.")
            product_name, table_name_raw = parts[0], parts[1]

            project_id, bq_dataset, bq_table_clean, bq_bucket_real = resolve_bq_coordinates(
                project_id=project_id,
                product_name=product_name,
                table_name=table_name_raw,
                bucket_name=bucket_name)
        except Exception as e:
            logging_service.log_error("Error resolviendo coordenadas BQ/GCS", user=user, error=str(e), destination=destination)
            raise InvalidUsage(f"Error de configuración de destino: {str(e)}", status_code=400)

        if env_id == 'sap':
            try:
                partes_bucket = bq_bucket_real.split('_')
                modulo = partes_bucket[3] if len(partes_bucket) > 3 else "manual"
                target_dataset = f"sdp_{modulo}_ddo"
            except Exception:
                target_dataset = f"sdp_{product_name}_ddo"
        elif env_id == 'pd':
            target_dataset = f"sdp_{bq_dataset}"
        else:
            target_dataset = f"sdp_{product_name.replace('-', '_')}"

        target_table_name = f"tbl_{bq_table_clean}"

        try:
            df = read_file_to_dataframe(file)
            df.columns = [clean_col_name(col) for col in df.columns]
            df = df.astype(str)
            df = df.replace('nan', "")
            
            now = datetime.now()
            year, month, day = now.strftime('%Y'), now.strftime('%m'), now.strftime('%d')
            df['year'] = year
            df['month'] = month
            df['day'] = day
        except Exception as e:
            logging_service.log_error("Error procesando contenido del archivo", user=user, error=str(e), filename=file.filename)
            raise InvalidUsage(f"No se pudo leer el archivo: {str(e)}", status_code=400)

        # Conversión a Parquet y Upload a GCS
        try:
            parquet_path = dataframe_to_parquet_tempfile(df, file.filename)
            final_blob_path = storage_service.upload_file(
                project_id, bucket_name, parquet_path, destination)
            
            if os.path.exists(parquet_path):
                os.remove(parquet_path)
        except Exception as e:
            logging_service.log_error("Error en persistencia GCS/Parquet", user=user, error=str(e), bucket=bucket_name)
            raise e 

        gcs_root_uri = f"gs://{bucket_name}/{destination}"
        final_schema = []
        metadata_dict = {}

        try:
            if schema_json and metadata_json:
                final_schema = json.loads(schema_json)
                metadata_dict = json.loads(metadata_json)
            else:
                for col in df.columns:
                    if col not in ['year', 'month', 'day']:
                        final_schema.append({'nombre': col})
        except json.JSONDecodeError as e:
            logging_service.log_error("Error parseando JSON de schema/metadata", user=user, error=str(e))
            raise InvalidUsage("El esquema o metadata proporcionado no es un JSON válido.", status_code=400)

        if schema_json and metadata_json:
            try:
                bq_service.create_table_entity(
                    project_id=project_id,
                    dataset_id=target_dataset,
                    table_id=target_table_name,
                    schema_data=final_schema,
                    gcs_root_path=gcs_root_uri,
                    metadata=metadata_dict
                )
            except Exception as e:
                logging_service.log_error("Error creando External Table en BigQuery", user=user,
                    file_name=file.filename, 
                    product=product,       
                    dataset=dataset,
                    error=str(e), table=f"{target_dataset}.{target_table_name}")
                raise InvalidUsage(f"Archivo subido, pero falló la creación de tabla externa: {e}", status_code=500)

        logging_service.log_info(
            "Ingesta External Table exitosa",
            user=user,
            table=f"{target_dataset}.{target_table_name}",
            gcs_path=final_blob_path
        )
        
        logging_service.log_info(
            "Archivo subido exitosamente",
            user=user,
            env_id=env_id,
            bucket=bucket_name,
            file_name=file.filename, 
            product=product,       
            dataset=dataset,        
            gcs_path=final_blob_path  
        )

        return jsonify({
            "message": f"Ingesta exitosa. Tabla externa {target_table_name} actualizada.",
            "c_storage": f"{bucket_name}/{dataset}",
            "b_query": f"{target_dataset}.{target_table_name}"
        })

    except InvalidUsage as e:
        raise e
    except Exception as e:
        logging_service.log_error("Fallo crítico no controlado en upload_file_api",
            file_name=file.filename, 
            product=product,       
            dataset=dataset, user=user, error=str(e))
        raise InvalidUsage(f"Error inesperado: {str(e)}", status_code=500)

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

        filename, df = storage_service.read_latest_dataset_content(
            project_id, bucket_name, product_path)

        if filename is None:
            return jsonify({"exists": False, "message": "No se encontraron archivos."})

        if df is None:
            return jsonify({"exists": True, "fileName": filename, "error": "Formato ilegible."})



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
        # orient='records' crea una lista de objetos: [{col1: val1}, {col1: val2}...]
        full_data = df.replace({np.nan: None}).to_dict(orient='records')

        return jsonify({
            "exists": True,
            "fileName": filename,
            # Lista simple de nombres
            "columns": [c['nombre'] for c in columnas],
            "rows": full_data,   
            "total_registros": len(df)
        })

    except InvalidUsage as e:
        raise e
    except Exception as e:
        print(e)
        raise InvalidUsage(
            f"Error al leer dataset completo: {e}", status_code=500)


@storage_bp.route("/products/save-data", methods=["POST"])
def save_full_data_api():
    """
    Recibe data del front -> Sube a GCS.
    """
    data = request.get_json()

    if not data:
        raise InvalidUsage("No payload.", status_code=400)

    # Extraemos datos
    env_id = data['env_id']
    bucket_name = data['bucket_name']
    product_name = data['product_name']
    table_name = data['table_name']
    rows = data['rows']
    user = data.get('user', 'anonymous')

    try:
        # 1. Subir a GCS
        project_id = get_project_id_for_bucket(env_id, bucket_name)
        product_path = f"{product_name}/{table_name}"

        filename, df = storage_service.read_latest_dataset_content(project_id, bucket_name, product_path)
        # Guardamos en Storage
        gcs_relative_path = storage_service.save_full_dataset(
            project_id, bucket_name, product_path, rows, filename
        )

        # Logging (Actualizado para no referenciar BQ)
        logging_service.log_info(
            "Dataset guardado en GCS",
            user=user,
            product=product_name,
            dataset=table_name,
            bucket=bucket_name,
            file_name=table_name, 
            gcs_path=gcs_relative_path,
            rows_processed=len(rows)
        )

        return jsonify({
            "success": True,
            "message": "Datos guardados exitosamente en Storage.",
            "path": gcs_relative_path
        })

    except Exception as e:
        logging_service.log_error("Error saving data to GCS", user=user, error=str(e))
        raise InvalidUsage(
            f"Error guardando en Storage: {e}", status_code=500)
    

@storage_bp.route("/products/<path:product_path>/download-excel", methods=["GET"])
def download_latest_dataset_excel(product_path):
    """
    Descarga el dataset más reciente como archivo Excel.
    """
    env_id = request.args.get('env_id')
    bucket_name = request.args.get('bucket_name')

    if not all([env_id, bucket_name]):
        raise InvalidUsage("Faltan parámetros.", status_code=400)

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)

        filename, df = storage_service.read_latest_dataset_content(
            project_id, bucket_name, product_path
        )

        if filename is None:
            raise InvalidUsage("No se encontraron archivos.", status_code=404)

        if df is None:
            raise InvalidUsage("Formato ilegible.", status_code=500)

        # Nombre del archivo Excel
        excel_filename = filename.replace(".parquet", ".xlsx")

        # Crear archivo temporal Excel
        temp_excel_path = storage_service.dataframe_to_excel_tempfile(
            df, excel_filename
        )

        # Enviar archivo
        response = send_file(
            temp_excel_path,
            as_attachment=True,
            download_name=excel_filename,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        # Cleanup después del response
        @response.call_on_close
        def cleanup():
            if os.path.exists(temp_excel_path):
                os.remove(temp_excel_path)

        return response

    except InvalidUsage as e:
        raise e
    except Exception as e:
        print(e)
        raise InvalidUsage(
            f"Error descargando Excel: {e}", status_code=500
        )
            

@storage_bp.route("/marketplace/products/<path:product_path>/download-excel", methods=["GET"])
def download_cdp_product_latest_excel(product_path):
    """
    Descarga un producto CDP completo como Excel.

    Cada tabla del producto queda en una hoja distinta.
    Usa la última partición year/month/day disponible por tabla.

    Ejemplo:
    GET /api/storage/marketplace/products/pd-mermas/download-excel?env_id=prd&bucket_name=raw-prd-osc-cdp-bucket
    """
    env_id = request.args.get("env_id")
    bucket_name = request.args.get("bucket_name")
    user = request.args.get("user", "anonymous")

    if not all([env_id, bucket_name]):
        raise InvalidUsage(
            "Los parámetros 'env_id' y 'bucket_name' son requeridos.",
            status_code=400
        )

    try:
        project_id = get_project_id_for_bucket(env_id, bucket_name)

        temp_excel_path, excel_filename = storage_service.cdp_product_latest_partitions_to_excel(
            project_id=project_id,
            bucket_name=bucket_name,
            product_name=product_path
        )

        logging_service.log_info(
            "Excel CDP generado correctamente",
            user=user,
            product=product_path,
            bucket=bucket_name,
            project_id=project_id,
            file_name=excel_filename
        )

        response = send_file(
            temp_excel_path,
            as_attachment=True,
            download_name=excel_filename,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        @response.call_on_close
        def cleanup():
            if os.path.exists(temp_excel_path):
                os.remove(temp_excel_path)

        return response

    except InvalidUsage as e:
        raise e

    except Exception as e:
        logging_service.log_error(
            "Error descargando producto CDP como Excel",
            user=user,
            product=product_path,
            bucket=bucket_name,
            error=str(e)
        )

        raise InvalidUsage(
            f"Error descargando producto CDP como Excel: {e}",
            status_code=500
        )