import { AxiosGet, AxiosPost, AxiosURLPut, AxiosResponse, AxiosPostForm } from "services/utils";

export interface FolderResponse {
  tables: string[];
}

export interface InitiateUploadResponse {
  sessionUrl: string;
  finalPath: string;
}

// 1. Obtener carpetas (Ya la tenías)
export const getFoldersService = async (
  envId: string, 
  bucketName: string,
  productPath: string 
): Promise<FolderResponse> => {
  const response = await AxiosGet(`/api/storage/folders/${productPath}`, {
    env_id: envId,
    bucket_name: bucketName
  });
  return response?.data;
};

// 1. CAMINO PESADO: Iniciar sesión resumable (Igual que antes)
export const initiateUploadService = async (
  envId: string,
  bucketName: string,
  destinationPath: string,
  fileName: string
): Promise<InitiateUploadResponse> => {
  const body = {
    env_id: envId,
    bucket_name: bucketName,
    destination: destinationPath,
    fileName: fileName
  };
  const response = await AxiosPost('/api/storage/initiate-resumable-upload', body);
  return response?.data;
};

// 2. CAMINO PESADO: Subir a GCS (Igual que antes)
export const uploadFileDirectlyService = async (
  sessionUrl: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<AxiosResponse> => {
  return await AxiosURLPut(sessionUrl, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  }, false);
};

// 3. NUEVO - CAMINO RÁPIDO: Subir al Backend (< 300MB)
export const uploadSmallFileService = async (
  envId: string,
  bucketName: string,
  destinationPath: string,
  file: File,
  onProgress: (percent: number) => void,
  // Argumentos opcionales para creación de tabla
  metadata?: any,
  schema?: any
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("env_id", envId);
  formData.append("bucket_name", bucketName);
  formData.append("destination", destinationPath);
  formData.append("user", "frontend-user");

  // Si vienen metadatos (tabla nueva), los agregamos como JSON String
  if (metadata && schema) {
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("schema", JSON.stringify(schema));
  }

  return await AxiosPostForm('/api/storage/upload', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent); 
      }
    }
  });
};

export const analyzeFileService = async (
  file: File,
  step: number,
  envId: string,
  bucketName: string,
  destination: string,
  // NUEVO ARGUMENTO
  isNewTable: boolean, 
  onProgress?: (percent: number) => void
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("step", step.toString());
  formData.append("env_id", envId);
  formData.append("bucket_name", bucketName);
  formData.append("destination", destination);
  
  // Enviamos la bandera para que el backend sepa si validar BQ o no
  formData.append("is_new_table", isNewTable ? "true" : "false");

  return await AxiosPostForm('/api/storage/analyze', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  });
};