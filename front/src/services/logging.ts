// services/Logging/loggingService.ts

import { AxiosGet } from "services/utils";

// --- TIPOS E INTERFACES (Respuesta Cruda de la API) ---

/**
 * Define la forma de un único registro de log que viene del backend.
 */
export interface LogEntryResponse {
  message: string;
  user: string | null;
  product: string | null;
  file_name: string | null; // Nota: snake_case como en el backend
  dataset: string | null;
  severity: string;
  timestamp: string;
}

/**
 * Define la forma de la respuesta completa de la API, que contiene una lista de logs.
 */
export interface LogsApiResponse {
  logs: LogEntryResponse[];
}


// --- FUNCIONES DEL SERVICIO ---

/**
 * Llama a GET /api/logs/product/<productName>
 * Obtiene los logs para un producto de datos específico.
 * @param productName El nombre del producto (ej. 'programa_fabricacion').
 * @param limit El número máximo de logs a obtener.
 */
export const getLogsByProduct = async (productName: string, limit: number = 50): Promise<LogsApiResponse> => {
  const uri = `/api/logs/product/${productName}`;
  // AxiosGet en tu utils.ts ya maneja la conversión de { limit } a ?limit=50
  const response = await AxiosGet(uri, { limit });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Error al cargar los logs del producto");
  }
  return response.data;
};

/**
 * Llama a GET /api/logs/user/<user>
 * Obtiene los logs para un usuario específico.
 * @param user El identificador del usuario (ej. 'bsandovalh').
 * @param limit El número máximo de logs a obtener.
 */
export const getLogsByUser = async (user: string, limit: number = 50): Promise<LogsApiResponse> => {
  const uri = `/api/logs/user/${user}`;
  const response = await AxiosGet(uri, { limit });
  
  if (response.status !== 200) {
    throw new Error(response.data.error || "Error al cargar los logs del usuario");
  }
  return response.data;
};