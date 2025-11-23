import google.cloud.logging
from google.cloud.logging import DESCENDING

client = google.cloud.logging.Client()
client.setup_logging()

logger = client.logger("plataforma-datos")


def get_all_logs_service(limit: int = 50):
    query = ""  # Sin filtros
    return _query_logs(query, limit)


def log_structured(level: str, message: str, user: str = None, product: str = None,
                   file_name: str = None, dataset: str = None):
    log_entry = {
        "message": message,
        "user": user,
        "product": product,
        "file_name": file_name,
        "dataset": dataset,
    }
    logger.log_struct(log_entry, severity=level.upper())


def log_info(message: str, user: str = None, product: str = None,
             file_name: str = None, dataset: str = None):
    log_structured("INFO", message, user, product, file_name, dataset)


def log_warning(message: str, user: str = None, product: str = None,
                file_name: str = None, dataset: str = None):
    log_structured("WARNING", message, user, product, file_name, dataset)


def log_error(message: str, user: str = None, product: str = None,
              file_name: str = None, dataset: str = None):
    log_structured("ERROR", message, user, product, file_name, dataset)


def get_logs_by_user(user: str, limit: int = 50):
    query = f'jsonPayload.user="{user}"'
    return _query_logs(query, limit)


def get_logs_by_product(product: str, limit: int = 50):
    query = f'jsonPayload.product="{product}"'
    return _query_logs(query, limit)


def _query_logs(query: str, limit: int):
    if not query:
        query = None  # Así no se aplica filtro

    entries = client.list_entries(
        order_by=DESCENDING,
        filter_=query,
        page_size=limit
    )
    logs = []
    for entry in entries:
        logs.append({
            "message": entry.payload.get("message") if isinstance(entry.payload, dict) else str(entry.payload),
            "user": entry.payload.get("user") if isinstance(entry.payload, dict) else None,
            "product": entry.payload.get("product") if isinstance(entry.payload, dict) else None,
            "file_name": entry.payload.get("file_name") if isinstance(entry.payload, dict) else None,
            "dataset": entry.payload.get("dataset") if isinstance(entry.payload, dict) else None,
            "severity": entry.severity,
            "timestamp": entry.timestamp.isoformat()
        })
    return logs
