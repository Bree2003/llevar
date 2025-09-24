import google.cloud.logging
import logging

client = google.cloud.logging.Client()
client.setup_logging()


def log_info(message):
    logging.info(message)


def log_error(message):
    logging.error(message)


def log_warning(message):
    logging.warning(message)
