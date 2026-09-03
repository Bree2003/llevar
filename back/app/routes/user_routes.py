from flask import Blueprint, jsonify, request, g
from app.services.firestore import users_service

user_bp = Blueprint("user", __name__)

@user_bp.route("/", methods=["GET"])
def list_users():
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    user = users_service.get_user(oid)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    #permissions = user.get("permissions", [])
    #if "admin" not in permissions:
        #return jsonify({"error": "User does not have the required permission"}), 403

    users = users_service.list_users(active_only=False, limit=1000)
    return jsonify(users), 200

@user_bp.route("/update", methods=["PUT"])
def update_user():
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

    if not "oid" in data:
        return jsonify({"error": "Missing 'oid' in request data"}), 400

    updated_user = users_service.update_user(data["oid"], **data)
    return jsonify(updated_user), 200
