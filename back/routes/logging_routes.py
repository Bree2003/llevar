from flask import Blueprint, request, jsonify
from services.gcp_logging import log_info, log_error, log_warning

logging_bp = Blueprint("logging", __name__)


@logging_bp.route("/info", methods=["POST"])
def log_info_api():
    data = request.json.get("message")
    log_info(data)
    return jsonify({"status": "logged info"})


@logging_bp.route("/error", methods=["POST"])
def log_error_api():
    data = request.json.get("message")
    log_error(data)
    return jsonify({"status": "logged error"})


@logging_bp.route("/warning", methods=["POST"])
def log_warning_api():
    data = request.json.get("message")
    log_warning(data)
    return jsonify({"status": "logged warning"})
