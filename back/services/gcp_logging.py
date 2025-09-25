import google.cloud.logging
from google.cloud.logging import DESCENDING
import logging

client = google.cloud.logging.Client()
client.setup_logging()

logger = client.logger("plataforma-datos")


def log_info(message: str, user: str = None, service: str = None, product: str = None):
    logger.log_struct(
        {
            "message": message,
            "user": user,
            "service": service,
            "product": product,
        },
        severity="INFO"
    )


def log_error(message: str, user: str = None, service: str = None, product: str = None):
    logger.log_struct(
        {
            "message": message,
            "user": user,
            "service": service,
            "product": product,
        },
        severity="ERROR"
    )


def log_warning(message: str, user: str = None, service: str = None, product: str = None):
    logger.log_struct(
        {
            "message": message,
            "user": user,
            "service": service,
            "product": product,
        },
        severity="WARNING"
    )
