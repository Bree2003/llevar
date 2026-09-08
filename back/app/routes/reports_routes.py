from flask import Blueprint, jsonify, request, g

from google.api_core.exceptions import NotFound

from app.services.firestore import reports_service, users_service


reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/", methods=["GET"])
def get_reports():
    reports = reports_service.list_reports()

    return jsonify(reports), 200


@reports_bp.route("/", methods=["POST"])
def create_report():
    oid = g.user_id

    if not oid:
        return jsonify({
            "error": "The token does not contain 'oid'"
        }), 400

    user = users_service.get_user(oid)

    if user is None:
        return jsonify({
            "error": "User not found"
        }), 404

    # permissions = user.get("permissions", [])
    # if "admin" not in permissions:
    #     return jsonify({
    #         "error": "User does not have the required permission"
    #     }), 403

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data provided"
        }), 400

    try:
        new_report = reports_service.create_report(data)

        return jsonify(new_report), 201

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400


@reports_bp.route("/<report_id>", methods=["PUT"])
def update_report(report_id):
    oid = g.user_id

    if not oid:
        return jsonify({
            "error": "The token does not contain 'oid'"
        }), 400

    user = users_service.get_user(oid)

    if user is None:
        return jsonify({
            "error": "User not found"
        }), 404

    # permissions = user.get("permissions", [])
    # if "admin" not in permissions:
    #     return jsonify({
    #         "error": "User does not have the required permission"
    #     }), 403

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data provided"
        }), 400

    try:
        updated_report = reports_service.update_report(
            report_id,
            data,
        )

        return jsonify(updated_report), 200

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400

    except NotFound as e:
        return jsonify({
            "error": str(e)
        }), 404


@reports_bp.route("/<report_id>", methods=["DELETE"])
def delete_report(report_id):
    oid = g.user_id

    if not oid:
        return jsonify({
            "error": "The token does not contain 'oid'"
        }), 400

    user = users_service.get_user(oid)

    if user is None:
        return jsonify({
            "error": "User not found"
        }), 404

    # permissions = user.get("permissions", [])
    # if "admin" not in permissions:
    #     return jsonify({
    #         "error": "User does not have the required permission"
    #     }), 403

    try:
        reports_service.delete_report(report_id)

        return jsonify({
            "message": f"Report with ID {report_id} has been deleted."
        }), 200

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400

    except NotFound as e:
        return jsonify({
            "error": str(e)
        }), 404
