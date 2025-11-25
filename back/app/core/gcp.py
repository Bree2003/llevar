from google.cloud import storage, logging
from app.config import Config

# Se inicializan una sola vez y se importan donde se necesiten
# El logging utiliza la variable GCP_PROJECT_ID en .env
logging_client = logging.Client()

# Se crea un cliente por cada project_id único en nuestra configuración
# Asegura que las operaciones se ejecuten en el contexto del proyecto correcto
storage_client = {
    env['project_id']: storage.Client(project=env['project_id'])
    for env in Config.GCP_ENVIRONMENTS
}

def get_storage_client(project_id: str):
    """
    Función de ayuda para obtener el cliente de Storage correcto para un project_id.
    Lanza un error si se solicita un cliente para un proyecto no configurado
    """
    
    client = storage_client.get(project_id)
    if not client:
        raise ValueError(f"No se encontró un cliente de Storage configurado para el project_id: '{project_id}'")
    return client