from typing import Any

from google.cloud import firestore
from google.api_core.exceptions import NotFound

from app.config import Config


COLLECTION = "links"
DOCUMENT_ID = "config"


DEFAULTS: dict[str, Any] = {
    "enlace_acceso_reporte": "",
    "enlace_soporte": "",
    "enlace_acceso_plataforma": "",
}


TEXT_FIELDS = (
    "enlace_acceso_reporte",
    "enlace_soporte",
    "enlace_acceso_plataforma",
)


_db: firestore.Client | None = None


def _client() -> firestore.Client:
    global _db

    if _db is None:
        _db = firestore.Client(
            database=f"cyt-{Config.ENV}-marketplace-db"
        )

    return _db


def _collection():
    return _client().collection(COLLECTION)


def _document():
    return _collection().document(DOCUMENT_ID)


def _serialize(snap) -> dict[str, Any]:
    data = snap.to_dict() or {}

    return {
        k: data.get(k, v)
        for k, v in DEFAULTS.items()
    }


def _clean(payload: dict[str, Any]) -> dict[str, Any]:
    changes = {
        key: payload[key]
        for key in DEFAULTS
        if key in payload
    }

    for field in TEXT_FIELDS:
        if field in changes:
            value = changes[field]

            if value is None:
                changes[field] = ""
            elif not isinstance(value, str):
                raise ValueError(
                    f"The '{field}' field must be a string"
                )
            else:
                changes[field] = value.strip()

    return changes


def get_links() -> dict[str, Any]:
    """
    Obtiene la configuración global de enlaces.

    Si todavía no existe el documento, retorna
    los valores por defecto.
    """
    snap = _document().get()

    if not snap.exists:
        return DEFAULTS.copy()

    return _serialize(snap)


def create_links(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Crea la configuración inicial de enlaces.

    Los tres enlaces son obligatorios.
    """
    changes = _clean(payload)

    for field in TEXT_FIELDS:
        if not changes.get(field):
            raise ValueError(
                f"The '{field}' field is required"
            )

    doc = {
        **DEFAULTS,
        **changes,
        "createdAt": firestore.SERVER_TIMESTAMP,
        "updatedAt": firestore.SERVER_TIMESTAMP,
    }

    ref = _document()

    if ref.get().exists:
        raise ValueError(
            "Links configuration already exists"
        )

    ref.create(doc)

    return {
        key: doc[key]
        for key in DEFAULTS
    }


def update_links(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Actualiza uno o más enlaces.

    Permite actualización parcial.
    """
    changes = _clean(payload)

    if not changes:
        raise ValueError(
            "There are no valid fields to update"
        )

    for field, value in changes.items():
        if not value:
            raise ValueError(
                f"The '{field}' field cannot be empty"
            )

    changes["updatedAt"] = firestore.SERVER_TIMESTAMP

    ref = _document()

    try:
        ref.update(changes)

    except NotFound:
        raise NotFound(
            "Links configuration does not exist"
        )

    return get_links()


def upsert_links(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Crea la configuración si no existe
    o actualiza los campos enviados si ya existe.

    Esta es probablemente la función más cómoda
    para una pantalla de administración.
    """
    changes = _clean(payload)

    if not changes:
        raise ValueError(
            "There are no valid fields to save"
        )

    for field, value in changes.items():
        if not value:
            raise ValueError(
                f"The '{field}' field cannot be empty"
            )

    ref = _document()
    snap = ref.get()

    if snap.exists:
        ref.set(
            {
                **changes,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            },
            merge=True,
        )
    else:
        doc = {
            **DEFAULTS,
            **changes,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP,
        }

        ref.set(doc)

    return get_links()
