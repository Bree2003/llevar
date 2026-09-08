import re
import unicodedata
from datetime import date
from typing import Any

from google.cloud import firestore
from google.api_core.exceptions import NotFound, AlreadyExists

from app.config import Config


COLLECTION = "reports"


DEFAULTS: dict[str, Any] = {
    "nombre": "",
    "descripcion": "",
    "area": "",
    "iframe": "",
    "kpis": [],
    "fechaModificacion": "",
}


TEXT_FIELDS = (
    "nombre",
    "descripcion",
    "area",
    "iframe",
)


_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")


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


def _normalize_id(value: str) -> str:
    report_id = (value or "").strip()

    if (
        not _ID_RE.match(report_id)
        or len(report_id.encode("utf-8")) > 1500
        or report_id in (".", "..")
        or report_id.startswith("__")
    ):
        raise ValueError(
            f"The identifier '{value}' is not valid"
        )

    return report_id


def _generate_report_id(nombre: str) -> str:
    """
    Replica la lógica utilizada en frontend:

    'Reporte Ventas Región' -> 'reporte-ventas-region'
    """

    normalized = unicodedata.normalize(
        "NFD",
        nombre or "",
    )

    normalized = "".join(
        character
        for character in normalized
        if unicodedata.category(character) != "Mn"
    )

    normalized = normalized.lower()

    normalized = re.sub(
        r"[^a-z0-9\s-]",
        "",
        normalized,
    )

    normalized = normalized.strip()

    normalized = re.sub(
        r"\s+",
        "-",
        normalized,
    )

    normalized = re.sub(
        r"-+",
        "-",
        normalized,
    )

    if not normalized:
        raise ValueError(
            "Could not generate a valid report identifier"
        )

    return _normalize_id(normalized)


def _serialize(snap) -> dict[str, Any]:
    data = snap.to_dict() or {}

    return {
        "id": snap.id,
        **{
            key: data.get(key, default)
            for key, default in DEFAULTS.items()
        },
    }


def _clean(payload: dict[str, Any]) -> dict[str, Any]:
    changes = {
        key: payload[key]
        for key in DEFAULTS
        if key in payload
    }

    # Limpiar strings
    for field in TEXT_FIELDS:
        if field in changes:
            changes[field] = (
                changes[field] or ""
            ).strip()

    # Limpiar KPIs
    if "kpis" in changes:
        kpis = changes["kpis"]

        if kpis is None:
            changes["kpis"] = []

        elif not isinstance(kpis, list):
            raise ValueError(
                "The 'kpis' field must be a list"
            )

        else:
            changes["kpis"] = [
                str(kpi).strip()
                for kpi in kpis
                if str(kpi).strip()
            ]

    return changes


def list_reports() -> list[dict[str, Any]]:
    ref = _collection()

    return sorted(
        (
            _serialize(document)
            for document in ref.stream()
        ),
        key=lambda report: (
            report["nombre"]
            or report["id"]
        ).lower(),
    )


def get_report(
    report_id: str,
) -> dict[str, Any] | None:
    target_id = _normalize_id(
        report_id
    )

    snap = (
        _collection()
        .document(target_id)
        .get()
    )

    if not snap.exists:
        return None

    return _serialize(snap)


def create_report(
    payload: dict[str, Any],
) -> dict[str, Any]:
    changes = _clean(payload)

    if not changes.get("nombre"):
        raise ValueError(
            "The 'nombre' field is required"
        )

    if not changes.get("descripcion"):
        raise ValueError(
            "The 'descripcion' field is required"
        )

    if not changes.get("area"):
        raise ValueError(
            "The 'area' field is required"
        )

    if not changes.get("iframe"):
        raise ValueError(
            "The 'iframe' field is required"
        )

    report_id = payload.get("id")

    if report_id:
        target_id = _normalize_id(
            report_id
        )
    else:
        target_id = _generate_report_id(
            changes["nombre"]
        )

    document = {
        **DEFAULTS,
        **changes,
    }

    document["fechaModificacion"] = (
        date.today().isoformat()
    )

    document["createdAt"] = (
        firestore.SERVER_TIMESTAMP
    )

    document["updatedAt"] = (
        firestore.SERVER_TIMESTAMP
    )

    ref = (
        _collection()
        .document(target_id)
    )

    try:
        ref.create(document)

    except AlreadyExists:
        raise ValueError(
            f"report '{target_id}' already exists"
        )

    return {
        "id": target_id,
        **{
            key: document[key]
            for key in DEFAULTS
        },
    }


def update_report(
    report_id: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    target_id = _normalize_id(
        report_id
    )

    changes = _clean(payload)

    if (
        "nombre" in changes
        and not changes["nombre"]
    ):
        raise ValueError(
            "The 'nombre' field cannot be empty"
        )

    if (
        "descripcion" in changes
        and not changes["descripcion"]
    ):
        raise ValueError(
            "The 'descripcion' field cannot be empty"
        )

    if (
        "area" in changes
        and not changes["area"]
    ):
        raise ValueError(
            "The 'area' field cannot be empty"
        )

    if (
        "iframe" in changes
        and not changes["iframe"]
    ):
        raise ValueError(
            "The 'iframe' field cannot be empty"
        )

    if not changes:
        raise ValueError(
            "There are no valid fields to update"
        )

    changes["fechaModificacion"] = (
        date.today().isoformat()
    )

    changes["updatedAt"] = (
        firestore.SERVER_TIMESTAMP
    )

    try:
        (
            _collection()
            .document(target_id)
            .update(changes)
        )

    except NotFound:
        raise NotFound(
            f"report '{target_id}' does not exist"
        )

    return get_report(target_id)


def delete_report(
    report_id: str,
) -> None:
    target_id = _normalize_id(
        report_id
    )

    ref = (
        _collection()
        .document(target_id)
    )

    if not ref.get().exists:
        raise NotFound(
            f"report '{target_id}' does not exist"
        )

    ref.delete()
