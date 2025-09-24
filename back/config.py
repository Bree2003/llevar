import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    GCS_BUCKET_NAME = os.environ.get('GCS_BUCKET_NAME')
    # Configuración de CORS
    CORS_ORIGINS = ["http://localhost:3000"]