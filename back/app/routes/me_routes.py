from flask import Blueprint, jsonify, request, g
from app.services.firestore import users_service

me_bp = Blueprint("me", __name__)

@me_bp.route("/permissions", methods=["GET"])
def my_permissions():
    oid = g.user_id
    email = g.user_email
    name = g.user_name
    surname = g.user_surname

    if not oid:
        return jsonify({"error": "The token does not contain 'oid'"}), 400

    user = users_service.get_user(oid)

    if user is None:
        try:
            user = users_service.create_user(
                oid,
                name=name,
                surname=surname,
                email=email or "",
                domains=[],
                permissions=[],
            )
        except users_service.UserAlreadyExists:
            user = users_service.get_user_or_raise(oid)
    elif email and user.get("email") != email:
        user = users_service.update_user(oid, email=email)

    return jsonify(user), 200
