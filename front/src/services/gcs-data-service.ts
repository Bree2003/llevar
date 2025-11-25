// services/Main/gcs-data.service.ts

import { AxiosGet, AxiosPost, AxiosPostFormData, AxiosPutResumable, AxiosPutSignedUrl } from "services/utils";
import { EnvironmentModel } from "store/models/gcsData"; // Reutilizamos el modelo de Redux

// --- INTERFACES PARA LAS RESPUESTAS CRUDAS DE LA API ---

export interface ProductsResponse {
  data_products: string[];
}

export interface SubfoldersResponse {
  tables: string[];
}

export interface LatestDatasetResponse {
  latest_dataset: string | null;
}

export interface UploadFileResponse {
  message: string;
}

export interface GenerateUrlParams {
  env_id: string;
  bucket_name: string;
  destination: string; // La ruta de la tabla, ej: "sap/stxh"
  fileName: string;
  contentType: string;
}

export interface GenerateUrlResponse {
  signedUrl: string;
  finalPath: string;
}


// Interfaces para el endpoint /analyze
export interface AnalyzeStep1Response {
  nombre_archivo: string;
  tamano: string;
  tipo_archivo: string;
  fecha_de_carga: string;
  hora_de_carga: string;
}
// Puedes añadir más interfaces para los pasos 2 y 3 si lo necesitas

// --- PARÁMETROS PARA LAS FUNCIONES DE SERVICIO ---

export interface GcsPathParams {
  env_id: string;
  bucket_name: string;
}

export interface UploadFileParams extends GcsPathParams {
  destination: string; // ej: "sap/stxh"
  user?: string;
  file: File;
}

export interface AnalyzeFileParams {
    step: '1' | '2' | '3';
    file: File;
}

// --- FUNCIONES DE SERVICIO ---

const BASE_URL = "/api/storage"; // URL base de nuestro blueprint de Flask

export const getEnvironmentsService = async () => {
  return await AxiosGet(`${BASE_URL}/environments`);
};

export const getProductsService = async (params: GcsPathParams) => {
  // AxiosGet se encarga de convertir { key: value } a ?key=value
  return await AxiosGet(`${BASE_URL}/products`, params);
};

export const getSubfoldersService = async (path: string, params: GcsPathParams) => {
  return await AxiosGet(`${BASE_URL}/folders/${path}`, params);
};

export const getLatestDatasetService = async (path: string, params: GcsPathParams) => {
  return await AxiosGet(`${BASE_URL}/products/${path}/latest-dataset`, params);
};

export const analyzeFileService = async (data: AnalyzeFileParams) => {
    const formData = new FormData();
    formData.append('step', data.step);
    formData.append('file', data.file);
    return await AxiosPostFormData(`${BASE_URL}/analyze`, formData);
};

// Se puede eliminar
export const uploadFileService = async (data: UploadFileParams) => {
  // Construimos el objeto FormData para la subida
  const formData = new FormData();
  formData.append("env_id", data.env_id);
  formData.append("bucket_name", data.bucket_name);
  formData.append("destination", data.destination);
  formData.append("file", data.file);
  if (data.user) {
    formData.append("user", data.user);
  }

  // Usamos nuestra nueva función para enviar FormData
  return await AxiosPostFormData(`${BASE_URL}/upload`, formData);
};

export const generateUploadUrlService = async (params: GenerateUrlParams) => {
  // Usamos AxiosPost normal porque hablamos con nuestra API
  return await AxiosPost(`${BASE_URL}/generate-upload-url`, params);
};

// Parámetros para iniciar la sesión
export interface InitiateUploadParams {
  env_id: string;
  bucket_name: string;
  destination: string; // La ruta de la tabla, ej: "sap/stxh"
  fileName: string;
}

// Respuesta de nuestro backend al iniciar la sesión
export interface InitiateUploadResponse {
  sessionUrl: string;
  finalPath: string;
}

// --- SERVICIOS DE SUBIDA REFACTORIZADOS ---

// Paso 1: Pedir la URL de sesión a nuestro backend
export const initiateResumableUploadService = async (params: InitiateUploadParams) => {
  return await AxiosPost(`/api/storage/initiate-resumable-upload`, params);
};

// Paso 2: Usar la URL de sesión para subir el archivo directamente a GCS
export const uploadFileResumableService = async (
  sessionUrl: string,
  file: File
) => {
  return await AxiosPutResumable(sessionUrl, file);
};

// ELIMINAR DESPUES SOLO PRUEBA
export const generateUploadUrlTestService = async (params: GenerateUrlParams) => {
  // Los parámetros son los mismos, pero la URL es la de prueba.
  // No necesitamos env_id ni bucket_name en el cuerpo, pero los mantenemos por consistencia del tipo.
  const body = {
    destination: params.destination,
    fileName: params.fileName,
    contentType: params.contentType,
  };
  return await AxiosPost(`${BASE_URL}/generate-upload-url-test`, body);
};
// ELIMINAR DESPUES SOLO PRUEBA

// Paso 2: Usar la URL firmada para subir el archivo directamente a GCS
export const uploadFileWithSignedUrlService = async (
  signedUrl: string,
  file: File
) => {
  // Usamos nuestra nueva función de Axios para la subida directa
  return await AxiosPutSignedUrl(signedUrl, file, file.type);
};