from flask import Blueprint, jsonify, request, g

from app.services.firestore import links_service, users_service


links_bp = Blueprint("links", __name__)


@links_bp.route("/", methods=["GET"])
def get_links():
    oid = g.user_id

    if not oid:
        return jsonify({
            "error": "The token does not contain 'oid'"
        }), 400

    have_permission = users_service.user_have_permission(
        oid=oid,
        permission="reader"
    )

    if not have_permission:
        return jsonify({
            "error": "User does not have the required permission"
        }), 403

    links = links_service.get_links()

    return jsonify(links), 200


@links_bp.route("/", methods=["PUT"])
def update_links():
    oid = g.user_id

    if not oid:
        return jsonify({
            "error": "The token does not contain 'oid'"
        }), 400

    have_permission = users_service.user_have_permission(
        oid=oid,
        permission="platform-admin"
    )

    if not have_permission:
        return jsonify({
            "error": "User does not have the required permission"
        }), 403

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data provided"
        }), 400

    try:
        updated_links = links_service.upsert_links(data)

        return jsonify(updated_links), 200

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400
