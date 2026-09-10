from flask import Blueprint, jsonify, request, g
from app.services.firestore import users_service

user_bp = Blueprint("user", __name__)

@user_bp.route("/", methods=["GET"])
def list_users():
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    have_permission = users_service.user_have_permission(oid=oid,
                                                         permission='platform-admin')
    if not have_permission:
        return jsonify({"error": "User does not have the required permission"}), 403

    users = users_service.list_users(active_only=False, limit=1000)
    return jsonify(users), 200

@user_bp.route("/update", methods=["PUT"])
def update_user():
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    have_permission = users_service.user_have_permission(oid=oid,
                                                         permission='platform-admin')
    if not have_permission:
        return jsonify({"error": "User does not have the required permission"}), 403

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    if not "oid" in data:
        return jsonify({"error": "Missing 'oid' in request data"}), 400

    payload = dict(data)
    target_oid = payload.pop("oid")

    updated_user = users_service.update_user(target_oid, **payload)
    return jsonify(updated_user), 200

@user_bp.route("/delete", methods=["DELETE"])
def delete_user():
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    have_permission = users_service.user_have_permission(oid=oid,
                                                         permission='platform-admin')
    if not have_permission:
        return jsonify({"error": "User does not have the required permission"}), 403

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    if not "oid" in data:
        return jsonify({"error": "Missing 'oid' in request data"}), 400

    try:
        payload = dict(data)
        target_oid = payload.pop("oid")
        users_service.delete_user(target_oid)
        return jsonify({"message": f"User with ID {target_oid} has been deleted."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except KeyError as e:
        return jsonify({"error": str(e)}), 500
