from flask import Blueprint, request, jsonify, send_file
from services.gcp_storage import list_files, upload_file, download_file, delete_file
from dotenv import load_dotenv
from services.file_converter import convert_to_parquet
import os

load_dotenv()

storage_bp = Blueprint("storage", __name__)

BUCKET_NAME = os.environ['GCS_BUCKET_NAME']


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
    destination = request.form.get("destination", file.filename.split('.')[0])

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
        return send_file(content, as_attachment=True, download_name=filename)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@storage_bp.route("/delete/<filename>", methods=["DELETE"])
def delete_file_api(filename):
    try:
        msg = delete_file(BUCKET_NAME, filename)
        return jsonify({"message": msg}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
