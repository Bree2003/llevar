from google.cloud import storage
import os

client = storage.Client()


def list_files(bucket_name):
    bucket = client.bucket(bucket_name)
    return [blob.name for blob in bucket.list_blobs()]


def upload_file(bucket_name, local_path, destination_blob_name):
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(local_path)
    return f"File {destination_blob_name} uploaded to {bucket_name}."


def download_file(bucket_name, blob_name):
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    return blob.download_as_bytes()


def delete_file(bucket_name, blob_name):
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.delete()
    return f"File {blob_name} deleted."
