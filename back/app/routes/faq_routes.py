from flask import Blueprint, jsonify, request, g
from app.services.firestore import faq_service, users_service

faq_bp = Blueprint("faq", __name__)

@faq_bp.route("/", methods=["GET"])
def get_faqs():
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    have_permission = users_service.user_have_permission(oid=oid,
                                                         permission='reader')
    if not have_permission:
        return jsonify({"error": "User does not have the required permission"}), 403

    faq = faq_service.list_faqs()
    return jsonify(faq), 200


@faq_bp.route("/", methods=["POST"])
def create_faq():
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

    try:
        new_faq = faq_service.create_faq(data)
        return jsonify(new_faq), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@faq_bp.route("/<faq_id>", methods=["PUT"])
def update_faq(faq_id):
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

    try:
        updated_faq = faq_service.update_faq(faq_id, data)
        return jsonify(updated_faq), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@faq_bp.route("/<faq_id>", methods=["DELETE"])
def delete_faq(faq_id):
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    have_permission = users_service.user_have_permission(oid=oid,
                                                         permission='platform-admin')
    if not have_permission:
        return jsonify({"error": "User does not have the required permission"}), 403

    try:
        faq_service.delete_faq(faq_id)
        return jsonify({"message": f"FAQ with ID {faq_id} has been deleted."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
