from flask import Blueprint, request, jsonify
from app.services import logging_service
from app.utils.exceptions import InvalidUsage

logging_bp = Blueprint("logging", __name__)

@logging_bp.route("/user/<string:user>", methods=["GET"])
def get_logs_user(user: str):
    try:
        limit = request.args.get('limit', default=5, type=int)
        logs = logging_service.get_logs_by_user(user, limit=limit)
        return jsonify({"logs": logs})
    except Exception as e:
        logging_service.log_error(f"Fallo al consultar logs para el usuario {user}", error=str(e))
        raise InvalidUsage(f"Error al consultar logs por usuario: {e}", status_code=500)

@logging_bp.route("/product/<string:product>", methods=["GET"])
def get_logs_product(product: str):
    try:
        limit = request.args.get('limit', default=15, type=int)
        logs = logging_service.get_logs_by_product(product, limit=limit)
        return jsonify({"logs": logs})
    except Exception as e:
        logging_service.log_error(f"Fallo al consultar logs para el producto {product}", error=str(e))
        raise InvalidUsage(f"Error al consultar logs por producto: {e}", status_code=500)