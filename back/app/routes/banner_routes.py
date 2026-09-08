from flask import Blueprint, jsonify, request, g
from app.config import Config
from app.services import storage_service, logging_service
from app.services.firestore import banner_service, users_service
from app.utils.exceptions import InvalidUsage

banner_bp = Blueprint("banner", __name__)

@banner_bp.route("/", methods=["GET"])
def get_banners():
    banner = banner_service.list_banners()
    return jsonify(banner), 200


@banner_bp.route("/", methods=["POST"])
def create_banner():
    oid = g.user_id

    if "file" not in request.files:
        logging_service.log_error("No se proporcionó ningún archivo.", user=oid)
        raise InvalidUsage("No se proporcionó ningún archivo.", status_code=400)

    file = request.files["file"]
    if not file.filename:
        logging_service.log_error("El archivo enviado no tiene nombre.", user=oid)
        raise InvalidUsage("El archivo enviado no tiene nombre.", status_code=400)

    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    user = users_service.get_user(oid)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    #permissions = user.get("permissions", [])
    #if "admin" not in permissions:
        #return jsonify({"error": "User does not have the required permission"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        project_id = Config.GCP_PROJECT_ID
        bucket_name = Config.GCP_PUBLIC_BUCKET
        uploaded_file = storage_service.upload_blob(project_id=project_id,
                                                    bucket_name=bucket_name,
                                                    file_path='banners',
                                                    file=file)

        if uploaded_file is None:
            return jsonify({"error: File could not be uploaded."}), 500

        curated_data = {
            "name": data["name"] if not None else "nameless-banner",
            "src": uploaded_file
        }

        new_banner = banner_service.create_banner(curated_data)
        return jsonify(new_banner), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@banner_bp.route("/<banner_id>", methods=["POST"])
def update_banner(banner_id):
    oid = g.user_id

    if "file" not in request.files:
        logging_service.log_error("No se proporcionó ningún archivo.", user=oid)
        raise InvalidUsage("No se proporcionó ningún archivo.", status_code=400)

    file = request.files["file"]
    if not file.filename:
        logging_service.log_error("El archivo enviado no tiene nombre.", user=oid)
        raise InvalidUsage("El archivo enviado no tiene nombre.", status_code=400)

    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    user = users_service.get_user(oid)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    #permissions = user.get("permissions", [])
    #if "admin" not in permissions:
        #return jsonify({"error": "User does not have the required permission"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        project_id = Config.GCP_PROJECT_ID
        bucket_name = Config.GCP_PUBLIC_BUCKET
        uploaded_file = storage_service.upload_blob(project_id=project_id,
                                                    bucket_name=bucket_name,
                                                    file_path='banners',
                                                    file=file)

        if uploaded_file is None:
            return jsonify({"error: File could not be uploaded."}), 500

        curated_data = {
            "name": data["name"] if not None else "nameless-banner",
            "src": uploaded_file
        }

        updated_banner = banner_service.update_banner(banner_id, curated_data)
        return jsonify(updated_banner), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@banner_bp.route("/<banner_id>", methods=["DELETE"])
def delete_banner(banner_id):
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    user = users_service.get_user(oid)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    #permissions = user.get("permissions", [])
    #if "admin" not in permissions:
        #return jsonify({"error": "User does not have the required permission"}), 403

    try:
        banner_service.delete_banner(banner_id)
        return jsonify({"message": f"banner with ID {banner_id} has been deleted."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
