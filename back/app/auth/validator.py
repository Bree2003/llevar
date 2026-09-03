# auth/validator.py
import jwt
from jwt import PyJWKClient
from app.config import Config

class AuthError(Exception):
    def __init__(self, message, status_code=401, code="invalid_token"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code

# PyJWKClient cachea las claves en memoria
_jwk_client = PyJWKClient(Config.JWKS_URL, cache_keys=True, lifespan=3600)


def decode_token(token: str) -> dict:
    try:
        signing_key = _jwk_client.get_signing_key_from_jwt(token).key
    except Exception as e:
        raise AuthError(f"Cannot resolve signing key: {e}")

    last_error = None
    for issuer in Config.ISSUERS:
        try:
            return jwt.decode(
                token,
                signing_key,
                algorithms=["RS256"],
                audience=Config.AZURE_AUDIENCES,
                issuer=issuer,
                options={
                    "require": ["exp", "iat", "aud", "iss", "sub"],
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_aud": True,
                    "verify_iss": True,
                },
                leeway=60,
            )
        except jwt.ExpiredSignatureError:
            raise AuthError("Expired token")
        except jwt.InvalidIssuerError as e:
            last_error = e
            continue
        except jwt.InvalidAudienceError:
            raise AuthError("Invalid audience")
        except jwt.InvalidTokenError as e:
            raise AuthError(f"Invalid token: {e}")

    raise AuthError(f"Invalid issuer: {last_error}")


def extract_bearer(header_value: str | None) -> str:
    if not header_value:
        raise AuthError("No Authorization header found")
    parts = header_value.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise AuthError("Authorization header malformed. Expected 'Bearer <token>'")
    return parts[1]
