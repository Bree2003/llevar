from flask import Blueprint, jsonify, request, g
from app.services.firestore import domains_service, users_service

domains_bp = Blueprint("domains", __name__)

@domains_bp.route("/", methods=["GET"])
def domains():
    domains = domains_service.list_domains(only_active=False)
    return jsonify(domains), 200


@domains_bp.route("/", methods=["POST"])
def create_domain():
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
        new_domain = domains_service.create_domain(data)
        return jsonify(new_domain), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@domains_bp.route("/<domain_id>", methods=["PUT"])
def update_domain(domain_id):
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
        updated_domain = domains_service.update_domain(domain_id, data)
        return jsonify(updated_domain), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
