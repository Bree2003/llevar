# auth/middleware.py
from functools import wraps
from flask import request, g, jsonify
from app.auth.validator import decode_token, extract_bearer, AuthError


def register_auth(app):
    @app.before_request
    def authenticate():
        if request.method == "OPTIONS":
            return None
        if request.path.startswith(app.config.get("AUTH_EXEMPT_PATHS", ())) or request.path in app.config.get("AUTH_EXEMPT_PATHS", ()):
            return None

        token = extract_bearer(request.headers.get("Authorization"))
        claims = decode_token(token)

        g.claims = claims
        g.token = token
        g.user_id = claims.get("oid")
        g.user_email = claims.get("unique_name") or claims.get("upn")
        g.user_name = claims.get("given_name")
        g.user_surname = claims.get("family_name")
        g.scopes = set((claims.get("scp") or "").split())
        if not g.scopes:
            raise AuthError("Token does not contain required scopes", 403, "insufficient_scope")

    @app.errorhandler(AuthError)
    def handle_auth_error(err):
        resp = jsonify({"error": err.code, "message": err.message})
        resp.status_code = err.status_code
        if err.status_code == 401:
            resp.headers["WWW-Authenticate"] = f'Bearer error="{err.code}"'
        return resp


def require_scope(*required, mode="any"):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            from flask import g
            granted = g.scopes | g.roles
            ok = granted.intersection(required) if mode == "any" else set(required).issubset(granted)
            if not ok:
                raise AuthError(
                    f"Scope required: {', '.join(required)}",
                    403, "insufficient_scope",
                )
            return fn(*args, **kwargs)
        return wrapper
    return decorator
