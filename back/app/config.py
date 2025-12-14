import os
import json
from dotenv import load_dotenv

# __file__ se refiere a config.py, dirname() nos da /app, dirname() de nuevo nos da la raíz
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    """
    Clase de configuración para cargar las variables de entorno
    """
    ENV = os.environ.get("ENV", "dev")
    SECRET_KEY = os.environ.get("SECRET_KEY")
    GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
    GOOGLE_APPLICATION_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    GCP_LOGGER_NAME = os.environ.get("GCP_LOGGER_NAME")
    
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "").split(",")
    
    # Cargar la configuración de entornos GCP desde un archivo fijo
    #    Esto garantiza que la variable siempre exista.
    config_filename = "environments.json"
    config_file_path = os.path.join(basedir, config_filename)

    try:
        #    abrir y leer el archivo.
        with open(config_file_path, 'r') as f:
            environment_file = json.load(f)
            if not ENV in environment_file:
                raise ValueError(f"El entorno '{ENV}' no está definido en el archivo '{config_filename}'")
            GCP_ENVIRONMENTS = environment_file[ENV]

    except FileNotFoundError:
        print(f"ERROR: El archivo de configuración '{config_file_path}' no se encontró.")
        GCP_ENVIRONMENTS = []
    except (json.JSONDecodeError, ValueError) as e:
        print(f"ERROR: No se pudo cargar o parsear el archivo '{config_file_path}': {e}")
        GCP_ENVIRONMENTS = []