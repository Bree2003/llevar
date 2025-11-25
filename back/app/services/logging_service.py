from google.cloud.logging import DESCENDING
from app.core.gcp import logging_client
from app.config import Config
from cachetools import cached, TTLCache

log_cache = TTLCache(maxsize=100, ttl=60)

logger = logging_client.logger(Config.GCP_LOGGER_NAME)


def log_structured(level: str, message: str, **kwargs):
    """
    Registra un log estructurado en Google Cloud Logging.
    """
    log_entry = {"message": message, **kwargs}
    logger.log_struct(log_entry, severity=level.upper())


def log_info(message: str, **kwargs):
    """
    Función de ayuda para registrar logs con nivel INFO.
    """
    log_structured("INFO", message, **kwargs)


def log_warning(message: str, **kwargs):
    """
    Función de ayuda para registrar logs con nivel WARNING.
    """
    log_structured("WARNING", message, **kwargs)


def log_error(message: str, **kwargs):
    """
    Función de ayuda para registrar logs con nivel ERROR.
    """
    log_structured("ERROR", message, **kwargs)


@cached(log_cache)
def _query_logs(query: str, limit: int):
    """
    Función interna que realiza la consulta real a la API de Google Cloud Logging.
    Los resultados de esta función son cacheados.
    """
    print(
        f"CACHE MISS: Realizando llamada a la API de GCP para la query='{query}' y limit={limit}")

    entries = logging_client.list_entries(
        order_by=DESCENDING, filter_=query, page_size=limit)
    logs = []

    for entry in entries:
        if len(logs) >= limit:
            break

        payload = entry.payload if isinstance(entry.payload, dict) else {
            "message": str(entry.payload)}

        logs.append({
            "message": payload.get("message"),
            "user": payload.get("user"),
            "product": payload.get("product"),
            "file_name": payload.get("file_name"),
            "dataset": payload.get("dataset"),
            "error": payload.get("error"),
            "severity": entry.severity,
            "timestamp": entry.timestamp.isoformat(),
        })

    return logs


def get_all_logs_service(limit: int = 50):
    """
    Obtiene los logs más recientes sin ningún filtro.
    Utiliza la función cacheada _query_logs.
    """
    query_filter = f'logName="projects/{Config.GCP_PROJECT_ID}/logs/{Config.GCP_LOGGER_NAME}"'
    return _query_logs(query=query_filter, limit=limit)


def get_logs_by_user(user: str, limit: int = 5):
    """
    Obtiene los logs más recientes para un usuario específico.
    Utiliza la función cacheada _query_logs.
    """
    query_filter = f'logName="projects/{Config.GCP_PROJECT_ID}/logs/{Config.GCP_LOGGER_NAME}" AND jsonPayload.user="{user}"'
    return _query_logs(query=query_filter, limit=limit)


def get_logs_by_product(product: str, limit: int = 50):
    """
    Obtiene los logs más recientes para un producto específico.
    Utiliza la función cacheada _query_logs.
    """
    query_filter = f'logName="projects/{Config.GCP_PROJECT_ID}/logs/{Config.GCP_LOGGER_NAME}" AND jsonPayload.product="{product}"'
    return _query_logs(query=query_filter, limit=limit)
