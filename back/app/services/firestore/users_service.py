from typing import Any
from google.cloud import firestore
from google.api_core.exceptions import AlreadyExists, NotFound
from app.config import Config

COLLECTION = "users"

# Campos conocidos y su valor por defecto al crear.
DEFAULTS: dict[str, Any] = {
    "name": "",
    "surname": "",
    "email": "",
    "domains": [],
    "permissions": [],
    "active": True,
}

# Campos que el cliente nunca debe poder sobrescribir directamente.
PROTECTED = frozenset({"oid", "created_at", "updated_at"})


class UserAlreadyExists(Exception):
    pass


class UserNotFound(Exception):
    pass


_db: firestore.Client | None = None


def _client() -> firestore.Client:
    global _db
    if _db is None:
        _db = firestore.Client(database=f"cyt-{Config.ENV}-marketplace-db")
    return _db


def _collection():
    return _client().collection(COLLECTION)


def _to_dict(snap) -> dict:
    return {"oid": snap.id, **snap.to_dict()}


def _clean(fields: dict) -> dict:
    """Quita campos protegidos y normaliza el email."""
    data = {k: v for k, v in fields.items() if k not in PROTECTED}
    if "email" in data and isinstance(data["email"], str):
        data["email"] = data["email"].strip().lower()
    return data


def create_user(oid: str, **fields) -> dict:
    """
    Crea el usuario. Falla si el oid ya existe.
    Acepta cualquier campo adicional además de los de DEFAULTS.
    """
    payload = {**DEFAULTS, **_clean(fields)}
    payload["created_at"] = firestore.SERVER_TIMESTAMP
    payload["updated_at"] = firestore.SERVER_TIMESTAMP
    try:
        _collection().document(oid).create(payload)
    except AlreadyExists:
        raise UserAlreadyExists(f"El usuario {oid} ya existe")
    return get_user(oid)


def get_user(oid: str) -> dict | None:
    """Devuelve el usuario o None si no existe."""
    snap = _collection().document(oid).get()
    return _to_dict(snap) if snap.exists else None


def get_user_or_raise(oid: str) -> dict:
    user = get_user(oid)
    if user is None:
        raise UserNotFound(f"El usuario {oid} no existe")
    return user


def get_user_permissions(oid: str) -> list | None:
    """Devuelve la lista de permisos del usuario o None si no existe."""
    user = get_user(oid)
    return user.get("permissions", []) if user else None


def get_user_domains(oid: str) -> list | None:
    """Devuelve la lista de dominios del usuario o None si no existe."""
    user = get_user(oid)
    return user.get("domains", []) if user else None


def user_have_permission(oid: str, permission: str) -> bool:
    """Devuelve True si el usuario tiene el permiso indicado."""
    perms = get_user_permissions(oid)
    if perms is None:
        return False
    
    for perm in perms:
        if perm.get("id") == permission:
            return True
    return False


def user_have_domain(oid: str, domain: str) -> bool:
    """Devuelve True si el usuario tiene el dominio indicado."""
    domains = get_user_domains(oid)
    if domains is None:
        return False
    
    for dom in domains:
        if dom.get("id") == domain:
            return True
    return False


def find_by_email(email: str) -> dict | None:
    docs = (
        _collection()
        .where(filter=firestore.FieldFilter("email", "==", email.strip().lower()))
        .limit(1)
        .stream()
    )
    return next((_to_dict(d) for d in docs), None)


def list_users(active_only: bool = True, limit: int = 1000) -> list:
    query = _collection()
    if active_only:
        query = query.where(filter=firestore.FieldFilter("active", "==", True))
    return [_to_dict(d) for d in query.limit(limit).stream()]


def update_user(oid: str, **fields) -> dict:
    """
    Actualiza solo los campos enviados (merge parcial).
    Falla si el usuario no existe.
    """
    data = _clean(fields)
    if not data:
        return get_user_or_raise(oid)
    data["updated_at"] = firestore.SERVER_TIMESTAMP
    try:
        _collection().document(oid).update(data)
    except NotFound:
        raise UserNotFound(f"El usuario {oid} no existe")
    return get_user(oid)


def upsert_user(oid: str, **fields) -> dict:
    """Crea o actualiza sin fallar en ninguno de los dos casos."""
    data = {**_clean(fields), "updated_at": firestore.SERVER_TIMESTAMP}
    ref = _collection().document(oid)
    if not ref.get().exists:
        data = {**DEFAULTS, **data, "created_at": firestore.SERVER_TIMESTAMP}
    ref.set(data, merge=True)
    return get_user(oid)


def delete_user(oid: str) -> None:
    """Borrado físico. Firestore no falla si el documento no existe."""
    _collection().document(oid).delete()


def deactivate_user(oid: str) -> dict:
    """Borrado lógico: preferible al físico para conservar trazabilidad."""
    return update_user(oid, active=False)
