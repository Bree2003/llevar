import re
import unicodedata
from typing import Any
from google.cloud import firestore
from google.api_core.exceptions import NotFound, AlreadyExists
from app.config import Config

COLLECTION = "dictionary"

DEFAULTS: dict[str, Any] = {
    "name": "",
    "description": "",
}

TEXT_FIELDS = ("name", "description")

_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")

_db: firestore.Client | None = None


def _client() -> firestore.Client:
    global _db
    if _db is None:
        _db = firestore.Client(database=f"cyt-{Config.ENV}-marketplace-db")
    return _db


def _collection():
    return _client().collection(COLLECTION)


def _normalize_id(value: str) -> str:
    dictionary_id = (value or "").strip()
    if (
        not _ID_RE.match(dictionary_id)
        or len(dictionary_id.encode("utf-8")) > 1500
        or dictionary_id in (".", "..")
        or dictionary_id.startswith("__")
    ):
        raise ValueError(f"The identifier '{value}' is not valid")
    return dictionary_id


def _serialize(snap) -> dict[str, Any]:
    data = snap.to_dict() or {}
    return {"id": snap.id, **{k: data.get(k, v) for k, v in DEFAULTS.items()}}


def _clean(payload: dict[str, Any]) -> dict[str, Any]:
    changes = {k: payload[k] for k in DEFAULTS if k in payload}
    for field in TEXT_FIELDS:
        if field in changes:
            changes[field] = (changes[field] or "").strip()
    return changes


def list_dictionaries() -> list[dict[str, Any]]:
    ref = _collection()
    return sorted(
        (_serialize(d) for d in ref.stream()),
        key=lambda p: (p["name"] or p["id"]),
    )


def get_dictionary(dictionary_id: str) -> dict[str, Any] | None:
    snap = _collection().document(_normalize_id(dictionary_id)).get()
    return _serialize(snap) if snap.exists else None


def create_dictionary(payload: dict[str, Any]) -> dict[str, Any]:
    changes = _clean(payload)
    if not changes.get("name"):
        raise ValueError("The 'name' field is required")

    doc = {**DEFAULTS, **changes}
    doc["createdAt"] = firestore.SERVER_TIMESTAMP
    doc["updatedAt"] = firestore.SERVER_TIMESTAMP

    ref = _collection().document()

    try:
        ref.create(doc)
    except AlreadyExists:
        raise ValueError(f"dictionary '{ref.id}' already exists")

    return {"id": ref.id, **{k: doc[k] for k in DEFAULTS}}


def update_dictionary(dictionary_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    target_id = _normalize_id(dictionary_id)

    changes = _clean(payload)
    if "name" in changes and not changes["name"]:
        raise ValueError("The 'name' field cannot be empty")
    if not changes:
        raise ValueError("There are no valid fields to update")

    changes["updatedAt"] = firestore.SERVER_TIMESTAMP

    try:
        _collection().document(target_id).update(changes)
    except NotFound:
        raise NotFound(f"dictionary '{target_id}' does not exist")

    return get_dictionary(target_id)


def delete_dictionary(dictionary_id: str) -> None:
    target_id = _normalize_id(dictionary_id)
    ref = _collection().document(target_id)
    if not ref.get().exists:
        raise NotFound(f"dictionary '{target_id}' does not exist")
    ref.delete()
