from google.cloud import storage
from app.utils.file_converter import clean_col_name

def get_schema_from_gcs_csv(bucket_name, blob_path):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_path)

    # leer solo el header (primeros bytes)
    content = blob.download_as_bytes(start=0, end=1024 * 512)

    raw_line = content.splitlines()[0]

    # fallback encoding
    try:
        first_line = raw_line.decode("utf-8")
    except UnicodeDecodeError:
        first_line = raw_line.decode("latin-1")

    delimiters = [",", ";", "\t", "|"]
    delimiter = max(delimiters, key=lambda d: first_line.count(d))

    columns = [c.strip().replace('"', '') for c in first_line.split(delimiter)]

    schema = []

    for col in columns:
        if not col:
            continue

        col_clean = clean_col_name(col)

        if col_clean in ["year", "month", "day"]:
            continue

        schema.append({"nombre": col_clean})

    return schema, delimiter