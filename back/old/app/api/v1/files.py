from flask import Blueprint, request, jsonify, current_app
from app.services import gcs_service

# Creamos el Blueprint. EL primer argumento es el nombre del blueprint
bp = Blueprint('files_v1', __name__)

@bp.route('/health', methods=['GET'])
def health_check():
    # Endpoint para verificar que la API está funcionando
    return jsonify({"status": "ok"}), 200

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No se encontró el archivo"}), 400
    
    file = request.files['file']
    
    if file.filename = '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400
    
    bucket_name = current_app.config['GCS_BUCKET_NAME']
    public_url = gcs_service.upload_to_gcs(file, bucket_name)
    
    if public_url:
        return jsonify({
            "message": "Archivo subido correctamente",
            "file_url": public_url
        }), 201
    else:
        return jsonify({"error": "No se pudo subir el archivo"}), 500