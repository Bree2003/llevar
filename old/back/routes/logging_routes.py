from flask import Blueprint, request, jsonify
from services.gcp_logging import (
    log_info, log_error, log_warning,
    get_logs_by_user, get_logs_by_product,
    get_all_logs_service
)

logging_bp = Blueprint("logging", __name__)


@logging_bp.route("/<level>", methods=["POST"])
def log_api(level: str):
    payload = request.get_json()
    message = payload.get("message")
    user = payload.get("user")
    product = payload.get("product")
    file_name = payload.get("file_name")
    dataset = payload.get("dataset")

    level = level.lower()
    if level == "info":
        log_info(message, user=user, product=product,
                 file_name=file_name, dataset=dataset)
    elif level == "warning":
        log_warning(message, user=user, product=product,
                    file_name=file_name, dataset=dataset)
    elif level == "error":
        log_error(message, user=user, product=product,
                  file_name=file_name, dataset=dataset)
    else:
        return jsonify({"error": "Invalid log level"}), 400

    return jsonify({"status": "logged", "level": level})


@logging_bp.route("/user/<string:user>", methods=["GET"])
def get_logs_user(user: str):
    try:
        logs = get_logs_by_user(user)
        return jsonify({"logs": logs}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@logging_bp.route("/product/<string:product>", methods=["GET"])
def get_logs_product(product: str):
    try:
        logs = get_logs_by_product(product)
        return jsonify({"logs": logs}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@logging_bp.route("/all", methods=["GET"])
def get_all_logs():
    try:
        logs = get_all_logs_service()
        return jsonify({"logs": logs}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
