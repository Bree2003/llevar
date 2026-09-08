import re
import unicodedata
from typing import Any
from google.cloud import firestore
from google.api_core.exceptions import NotFound, AlreadyExists
from app.config import Config

COLLECTION = "faq"

DEFAULTS: dict[str, Any] = {
    "question": "",
    "answer": "",
}

TEXT_FIELDS = ("question", "answer")

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
    faq_id = (value or "").strip()
    if (
        not _ID_RE.match(faq_id)
        or len(faq_id.encode("utf-8")) > 1500
        or faq_id in (".", "..")
        or faq_id.startswith("__")
    ):
        raise ValueError(f"The identifier '{value}' is not valid")
    return faq_id


def _serialize(snap) -> dict[str, Any]:
    data = snap.to_dict() or {}
    return {"id": snap.id, **{k: data.get(k, v) for k, v in DEFAULTS.items()}}


def _clean(payload: dict[str, Any]) -> dict[str, Any]:
    changes = {k: payload[k] for k in DEFAULTS if k in payload}
    for field in TEXT_FIELDS:
        if field in changes:
            changes[field] = (changes[field] or "").strip()
    return changes


def list_faqs() -> list[dict[str, Any]]:
    return sorted(
        (_serialize(d) for d in _collection().stream()),
        key=lambda p: (p["question"] or p["id"]),
    )


def get_faq(faq_id: str) -> dict[str, Any] | None:
    snap = _collection().document(_normalize_id(faq_id)).get()
    return _serialize(snap) if snap.exists else None


def create_faq(payload: dict[str, Any]) -> dict[str, Any]:
    changes = _clean(payload)
    if not changes.get("question"):
        raise ValueError("The 'question' field is required")
    if not changes.get("answer"):
        raise ValueError("The 'answer' field is required")

    doc = {**DEFAULTS, **changes}
    doc["createdAt"] = firestore.SERVER_TIMESTAMP
    doc["updatedAt"] = firestore.SERVER_TIMESTAMP

    ref = _collection().document()

    try:
        ref.create(doc)
    except AlreadyExists:
        raise ValueError(f"faq '{ref.id}' already exists")

    return {"id": ref.id, **{k: doc[k] for k in DEFAULTS}}


def update_faq(faq_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    target_id = _normalize_id(faq_id)

    changes = _clean(payload)
    for field in TEXT_FIELDS:
        if field in changes and not changes:
            raise ValueError(f"The '{field}' field cannot be empty")
    if not changes:
        raise ValueError("There are no valid fields to update")

    changes["updatedAt"] = firestore.SERVER_TIMESTAMP

    try:
        _collection().document(target_id).update(changes)
    except NotFound:
        raise NotFound(f"faq '{target_id}' does not exist")

    return get_faq(target_id)


def delete_faq(faq_id: str) -> None:
    target_id = _normalize_id(faq_id)
    ref = _collection().document(target_id)
    if not ref.get().exists:
        raise NotFound(f"faq '{target_id}' does not exist")
    ref.delete()
