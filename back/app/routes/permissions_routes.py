from flask import Blueprint, jsonify, request, g
from app.services.firestore import permissions_service, users_service

permissions_bp = Blueprint("permissions", __name__)

@permissions_bp.route("/", methods=["GET"])
def permissions():
    permissions = permissions_service.list_permissions(only_active=False)
    return jsonify(permissions), 200


@permissions_bp.route("/", methods=["POST"])
def create_permission():
    oid = g.user_id
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
        new_permission = permissions_service.create_permission(data)
        return jsonify(new_permission), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@permissions_bp.route("/<permission_id>", methods=["PUT"])
def update_permission(permission_id):
    oid = g.user_id
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
        updated_permission = permissions_service.update_permission(permission_id, data)
        return jsonify(updated_permission), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
