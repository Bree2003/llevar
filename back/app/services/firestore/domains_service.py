import re
import unicodedata
from typing import Any
from google.cloud import firestore
from google.api_core.exceptions import NotFound, AlreadyExists
from app.config import Config

COLLECTION = "domains"

DEFAULTS: dict[str, Any] = {
    "name": "",
    "description": "",
    "active": True,
}

TEXT_FIELDS = ("name", "description")

_ID_RE = re.compile(r"^[a-z0-9][a-z0-9._-]*$")

_db: firestore.Client | None = None


def _client() -> firestore.Client:
    global _db
    if _db is None:
        _db = firestore.Client(database=f"cyt-{Config.ENV}-marketplace-db")
    return _db


def _collection():
    return _client().collection(COLLECTION)


def _slugify(value: str) -> str:
    s = unicodedata.normalize("NFD", (value or "").strip().lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9._-]+", "_", s)
    return s.strip("_")


def _normalize_id(value: str) -> str:
    domain_id = (value or "").strip().lower()
    if (
        not _ID_RE.match(domain_id)
        or len(domain_id) > 1500
        or domain_id in (".", "..")
        or domain_id.startswith("__")
    ):
        raise ValueError(
            f"The identifier '{value}' is not valid: use lowercase letters, "
            "digits, '.', '_' or '-', starting with a letter or digit"
        )
    return domain_id


def _serialize(snap) -> dict[str, Any]:
    data = snap.to_dict() or {}
    return {"id": snap.id, **{k: data.get(k, v) for k, v in DEFAULTS.items()}}


def _clean(payload: dict[str, Any]) -> dict[str, Any]:
    changes = {k: payload[k] for k in DEFAULTS if k in payload}
    for field in TEXT_FIELDS:
        if field in changes:
            changes[field] = (changes[field] or "").strip()
    if "active" in changes:
        changes["active"] = bool(changes["active"])
    return changes


def list_domains(only_active: bool = False) -> list[dict[str, Any]]:
    ref = _collection()
    if only_active:
        ref = ref.where(filter=firestore.FieldFilter("active", "==", True))
    return sorted(
        (_serialize(d) for d in ref.stream()),
        key=lambda p: (p["name"] or p["id"]).lower(),
    )


def get_domain(domain_id: str) -> dict[str, Any] | None:
    snap = _collection().document(_normalize_id(domain_id)).get()
    return _serialize(snap) if snap.exists else None


def create_domain(payload: dict[str, Any]) -> dict[str, Any]:
    raw_id = (payload.get("id") or "").strip()
    if not raw_id:
        raise ValueError("The 'id' field is required")
    domain_id = _normalize_id(raw_id)

    changes = _clean(payload)
    if not changes.get("name"):
        raise ValueError("The 'name' field is required")

    doc = {**DEFAULTS, **changes}
    doc["createdAt"] = firestore.SERVER_TIMESTAMP
    doc["updatedAt"] = firestore.SERVER_TIMESTAMP

    try:
        _collection().document(domain_id).create(doc)
    except AlreadyExists:
        raise ValueError(f"domain '{domain_id}' already exists")

    return {"id": domain_id, **{k: doc[k] for k in DEFAULTS}}


def update_domain(domain_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    target_id = _normalize_id(domain_id)

    if "id" in payload and _normalize_id(str(payload["id"])) != target_id:
        raise ValueError("The 'id' field cannot be modified")

    changes = _clean(payload)
    if "name" in changes and not changes["name"]:
        raise ValueError("The 'name' field cannot be empty")
    if not changes:
        raise ValueError("There are no valid fields to update")

    changes["updatedAt"] = firestore.SERVER_TIMESTAMP

    try:
        _collection().document(target_id).update(changes)
    except NotFound:
        raise NotFound(f"domain '{target_id}' does not exist")

    return get_domain(target_id)


def set_domain_active(domain_id: str, active: bool) -> dict[str, Any]:
    return update_domain(domain_id, {"active": active})


def rename_domain(old_id: str, new_id: str) -> dict[str, Any]:
    source_id = _normalize_id(old_id)
    target_id = _normalize_id(new_id)
    if source_id == target_id:
        raise ValueError("The new identifier must be different from the current one")

    old_ref = _collection().document(source_id)
    snap = old_ref.get()
    if not snap.exists:
        raise NotFound(f"domain '{source_id}' does not exist")

    doc = snap.to_dict() or {}
    doc["updatedAt"] = firestore.SERVER_TIMESTAMP

    try:
        _collection().document(target_id).create(doc)
    except AlreadyExists:
        raise ValueError(f"domain '{target_id}' already exists")

    old_ref.delete()
    return get_domain(target_id)


def delete_domain(domain_id: str) -> None:
    target_id = _normalize_id(domain_id)
    ref = _collection().document(target_id)
    if not ref.get().exists:
        raise NotFound(f"domain '{target_id}' does not exist")
    ref.delete()
