from flask import Blueprint, request, jsonify, send_file
from services.gcp_storage import list_files, upload_file, download_file, delete_file
from dotenv import load_dotenv
from services.file_converter import convert_to_parquet
import os
import pandas as pd
import numpy as np
import io

load_dotenv()

storage_bp = Blueprint("storage", __name__)

BUCKET_NAME = os.environ.get('GCS_BUCKET_NAME')


def read_file_to_dataframe(file_storage):
    try:
        file_storage.seek(0)
        filename = file_storage.filename
        ext = filename.split('.')[-1].lower() if filename else ''
        df = None

        if ext == 'csv':
            try:
                df = pd.read_csv(file_storage, sep=None, engine='python')
            except UnicodeDecodeError:
                file_storage.seek(0)
                df = pd.read_csv(file_storage, encoding='latin-1',
                                 sep=None, engine='python')
        elif ext in ['xlsx', 'xls']:
            df = pd.read_excel(file_storage)

        if df is None:
            return None, f"Formato de archivo no soportado: {ext}"

        df = df.where(pd.notnull(df), None)  # Convertir NaN a None
        return df, None
    except Exception as e:
        return None, f"Error al leer el archivo: {str(e)}"


@storage_bp.route("/analyze", methods=["POST"])
def analyze_file_api():
    if "file" not in request.files:
        return jsonify({"error": "No se proporcionó ningún archivo"}), 400

    file = request.files["file"]
    step = request.form.get("step", "1")

    try:
        df, error = read_file_to_dataframe(file)
        if error:
            return jsonify({"error": error}), 400

        if df is None:
            return jsonify({"error": "No se pudo procesar el DataFrame."}), 500

        if not file.filename:
            return jsonify({"error": "El archivo enviado no tiene nombre."}), 400

        if step == "1":
            file.seek(0)
            tamano = round(len(file.read()) / 1024, 2)
            file.seek(0)

            metadata = {
                "producto_dato": "Ingesta Archivos",
                "dataset_destino": os.path.splitext(file.filename)[0],
                "nombre_archivo": file.filename,
                "usuario": "breeale2003@gmail.com",  # cambiar por usuario real
                "tamano": f"{tamano} KB",
                "fecha_de_carga": pd.Timestamp.now().strftime('%d-%m-%Y'),
                "hora_de_carga": pd.Timestamp.now().strftime('%H:%M horas'),
                "tipo_archivo": file.filename.split('.')[-1].upper(),
            }
            return jsonify(metadata), 200

        elif step == "2":
            def map_dtype(dtype):
                if pd.api.types.is_integer_dtype(dtype) or pd.api.types.is_float_dtype(dtype):
                    return "Number"
                elif pd.api.types.is_datetime64_any_dtype(dtype):
                    return "Date"
                else:
                    return "Text"

            df = df.where(pd.notnull(df), None)  # Evitar NaN en JSON
            columnas = [
                {"nombre": col, "tipo": map_dtype(dtype)} for col, dtype in df.dtypes.items()
            ]
            vista_previa = df.head(5).replace(
                {np.nan: None}).to_dict(orient='records')

            structure_data = {
                "numero_columnas": len(df.columns),
                "numero_registros": len(df),
                "columnas_encontradas": columnas,
                "vista_previa": vista_previa
            }
            return jsonify(structure_data), 200

        elif step == "3":
            alerts = []
            columnas_esperadas = {'CuartoFiltro',
                                  'Material', 'Descripción', 'BOT', 'Fecha'}
            columnas_actuales = set(df.columns)
            columnas_adicionales = list(columnas_actuales - columnas_esperadas)

            if 'CuartoFiltro' in df.columns and df['CuartoFiltro'].isnull().sum() > 0:
                alerts.append(
                    f"Alerta: La columna 'CuartoFiltro' tiene {df['CuartoFiltro'].isnull().sum()} registros nulos."
                )

            if 'BOT' in df.columns and not pd.api.types.is_numeric_dtype(df['BOT']):
                alerts.append(
                    "Alerta: La columna 'BOT' contiene valores no numéricos y se esperaba un decimal."
                )

            if columnas_adicionales:
                alerts.append(
                    f"Se detectaron columnas adicionales no esperadas: {', '.join(columnas_adicionales)}"
                )

            return jsonify({"alertas": alerts}), 200

        else:
            return jsonify({"error": f"Paso desconocido: {step}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@storage_bp.route("/list", methods=["GET"])
def list_files_api():
    try:
        files = list_files(BUCKET_NAME)
        return jsonify(files), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@storage_bp.route("/upload", methods=["POST"])
def upload_file_api():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if not file.filename:
        return jsonify({"error": "El archivo enviado no tiene nombre."}), 400

    destination = request.form.get(
        "destination", os.path.splitext(file.filename)[0]
    )

    try:
        parquet_path = convert_to_parquet(file, file.filename)
        msg = upload_file(BUCKET_NAME, parquet_path, destination + ".parquet")
        os.remove(parquet_path)
        return jsonify({"message": msg}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@storage_bp.route("/download/<filename>", methods=["GET"])
def download_file_api(filename):
    try:
        content = download_file(BUCKET_NAME, filename)
        return send_file(
            io.BytesIO(content),
            as_attachment=True,
            download_name=filename,
            mimetype='application/octet-stream'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@storage_bp.route("/delete/<filename>", methods=["DELETE"])
def delete_file_api(filename):
    try:
        msg = delete_file(BUCKET_NAME, filename)
        return jsonify({"message": msg}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
