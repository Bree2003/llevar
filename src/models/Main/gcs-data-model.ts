// models/Main/gcs-data.model.ts

import { AnalyzeStep1Response, InitiateUploadResponse, LatestDatasetResponse, ProductsResponse, SubfoldersResponse, UploadFileResponse } from "services/gcs-data-service";
import { EnvironmentModel } from "store/models/gcsData";

// --- MODELOS DE DATOS INTERNOS DE LA APLICACIÓN ---
// (En muchos casos, son más simples que las respuestas de la API)

export type ProductModel = string[];
export type TableModel = string[];
export type LatestDatasetModel = string | null;
export type UploadFileResultModel = string;
export type AnalyzeFileResultModel = AnalyzeStep1Response; // O un modelo más complejo si es necesario

// --- FUNCIONES DE TRANSFORMACIÓN ---

export const EnvironmentsResponseToModel = (data: EnvironmentModel[]): EnvironmentModel[] => {
  // La respuesta ya coincide con nuestro modelo, así que solo la devolvemos.
  return data;
};

export const ProductsResponseToModel = (data: ProductsResponse): ProductModel => {
  // Extraemos solo el array de strings.
  return data.data_products || [];
};

export const SubfoldersResponseToModel = (data: SubfoldersResponse): TableModel => {
  // Extraemos solo el array de strings.
  return data.tables || [];
};

export const LatestDatasetResponseToModel = (data: LatestDatasetResponse): LatestDatasetModel => {
  // Extraemos el string o el valor null.
  return data.latest_dataset;
};

export const UploadFileResponseToModel = (data: UploadFileResponse): UploadFileResultModel => {
    // Extraemos solo el mensaje de éxito.
    return data.message;
};

export const AnalyzeFileResponseToModel = (data: AnalyzeStep1Response): AnalyzeFileResultModel => {
    // Por ahora, la respuesta coincide con nuestro modelo.
    return data;
};

// Modelo interno para la sesión de subida
export interface ResumableUploadSessionModel {
    sessionUrl: string;
    finalPath: string;
}

// Función de transformación
export const InitiateUploadResponseToModel = (data: InitiateUploadResponse): ResumableUploadSessionModel => {
    // La respuesta ya es limpia, así que solo la pasamos.
    // Esto mantiene la consistencia de la arquitectura.
    return {
        sessionUrl: data.sessionUrl,
        finalPath: data.finalPath,
    };
};