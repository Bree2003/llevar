from app.config import Config
from app.utils.exceptions import InvalidUsage

def get_project_id_for_bucket(env_id, bucket_name) -> str:
    """
    Valida que un bucket pertenece a un entorno y devuelve el project_id correcto.

    Args:
        env_id (str): El ID del entorno ("sap", "pd").
        bucket_name (str): El nombre del bucket que se quiere acceder.

    Raises:
        InvalidUsage: Si el entorno no existe o si el bucket no pertenece a ese entorno.

    Returns:
        str: El project_id verificado para usar en las llamadas a GCP.
    """
    # 1. Buscar el entorno por su ID
    target_env = next((env for env in Config.GCP_ENVIRONMENTS if env.get('id') == env_id), None)
    
    if not target_env:
        raise InvalidUsage(f"El entorno con id '{env_id}' no está configurado.", status_code=400)
        
    # 2. Validar que el bucket está en la lista de buckets de ese entorno
    if bucket_name not in target_env.get('buckets', []):
        raise InvalidUsage(f"El bucket '{bucket_name}' no pertenece al entorno '{env_id}'.", status_code=403) # 403 Forbidden es más apropiado
        
    # 3. Si todo es correcto, devolver el project_id asociado
    return target_env['project_id']