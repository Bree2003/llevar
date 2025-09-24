from google.oauth2 import service_account
from google.cloud import storage
from dotenv import load_dotenv
import os

load_dotenv()

# Load credentials from environment variables
credentials_path = os.environ['GOOGLE_APPLICATION_CREDENTIALS']
project_id = os.environ['GCP_PROJECT_ID']
bucket_name = os.environ['GCP_BUCKET_NAME']

print(credentials_path)
print(project_id)
print(bucket_name)

# Create a credentials object
credentials = service_account.Credentials.from_service_account_file(credentials_path)

# print(credentials)

def upload_blob():
    local_dir = "input"
    
    # Set client to access GCP storage bucket
    client = storage.Client(credentials=credentials, project=project_id)
    bucket = client.bucket(bucket_name)
    
    # Read all files from directory and upload to bucket
    filenames = os.listdir(local_dir)
    for filename in filenames:
        full_file_path = os.path.join(local_dir, filename)
        blob = bucket.blob(filename)
        with open(full_file_path, "r") as fl:
            blob.upload_from_string(fl.read())

def list_blobs():
    # Set client to access GCP storage bucket
    client = storage.Client(credentials=credentials, project=project_id)
    bucket = client.bucket(bucket_name)
    
    # List blobs in the bucket
    blobs = bucket.list_blobs()
    for blob in blobs:
        print(blob.name)

def read_blob_data():
    # Set client to access GCP storage bucket
    client = storage.Client(credentials=credentials, project=project_id)
    bucket = client.bucket(bucket_name)
    
    # List and download blobs in the bucket
    blobs = bucket.list_blobs()
    for blob in blobs:
        data = blob.download_as_text()
        print(data)

# Main
if __name__ == "__main__":
    upload_blob()
    list_blobs()
    read_blob_data()