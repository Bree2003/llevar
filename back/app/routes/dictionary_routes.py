from flask import Blueprint, jsonify, request, g
from app.services.firestore import dictionary_service, users_service

dictionary_bp = Blueprint("dictionary", __name__)

@dictionary_bp.route("/", methods=["GET"])
def get_dictionarys():
    dictionary = dictionary_service.list_dictionaries()
    return jsonify(dictionary), 200


@dictionary_bp.route("/", methods=["POST"])
def create_dictionary():
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
        new_dictionary = dictionary_service.create_dictionary(data)
        return jsonify(new_dictionary), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@dictionary_bp.route("/<dictionary_id>", methods=["PUT"])
def update_dictionary(dictionary_id):
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
        updated_dictionary = dictionary_service.update_dictionary(dictionary_id, data)
        return jsonify(updated_dictionary), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@dictionary_bp.route("/<dictionary_id>", methods=["DELETE"])
def delete_dictionary(dictionary_id):
    oid = g.user_id
    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    user = users_service.get_user(oid)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    #permissions = user.get("permissions", [])
    #if "admin" not in permissions:
        #return jsonify({"error": "User does not have the required permission"}), 403

    try:
        dictionary_service.delete_dictionary(dictionary_id)
        return jsonify({"message": f"Dictionary with ID {dictionary_id} has been deleted."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
