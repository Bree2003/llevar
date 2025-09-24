from google.cloud import storage
from werkzeug.utils import secure_filename
import uuid

def upload_to_gcs(file, bucket_name):
    # Sube un archivo a un bucket de Google Cloud Storage

    if not file:
        return None
    
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        
        # Generar un nombre de archivo seguro y único
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}--{filename}"
        
        blob = bucket.blob(unique_filename)
        
        # Verificar que el archivo sea del tipo requerido para el bucket
        blob.upload_from_file(
            file,
            content_type=file.content_type
        )
        
        return blob.public_url
    except Exception as e:
        print(f"Error al subir el archivo: {e}")
        return None