import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
    GCS_BUCKET_NAME = os.environ.get("GCS_BUCKET_NAME")
    GOOGLE_APPLICATION_CREDENTIALS = os.environ.get(
        "GOOGLE_APPLICATION_CREDENTIALS")

    # CORS config (se puede pasar como lista)
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "").split(",")
