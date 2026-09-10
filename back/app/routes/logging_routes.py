from flask import Blueprint, request, jsonify, g
from app.services import logging_service
from app.services.firestore import users_service
from app.utils.exceptions import InvalidUsage

logging_bp = Blueprint("logging", __name__)

@logging_bp.route("/user/<string:user>", methods=["GET"])
def get_logs_user(user: str):
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    have_permission = users_service.user_have_permission(oid=oid,
                                                         permission='reader')
    if not have_permission:
        return jsonify({"error": "User does not have the required permission"}), 403

    try:
        limit = request.args.get('limit', default=5, type=int)
        logs = logging_service.get_logs_by_user(user, limit=limit)
        return jsonify({"logs": logs})
    except Exception as e:
        logging_service.log_error(f"Fallo al consultar logs para el usuario {user}", error=str(e))
        raise InvalidUsage(f"Error al consultar logs por usuario: {e}", status_code=500)

@logging_bp.route("/product/<string:product>", methods=["GET"])
def get_logs_product(product: str):
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    have_permission = users_service.user_have_permission(oid=oid,
                                                         permission='reader')
    if not have_permission:
        return jsonify({"error": "User does not have the required permission"}), 403

    try:
        limit = request.args.get('limit', default=15, type=int)
        logs = logging_service.get_logs_by_product(product, limit=limit)
        return jsonify({"logs": logs})
    except Exception as e:
        logging_service.log_error(f"Fallo al consultar logs para el producto {product}", error=str(e))
        raise InvalidUsage(f"Error al consultar logs por producto: {e}", status_code=500)