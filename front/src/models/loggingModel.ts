// models/Logging/loggingModel.ts

import { LogEntryResponse, LogsApiResponse } from "services/logging";


// --- INTERFACES DEL MODELO (Datos Limpios para la UI) ---

/**
 * Define la estructura de datos de un log limpio que usarán los componentes.
 * Nota: hemos convertido file_name a fileName para seguir la convención de camelCase.
 */
export interface LogModel {
  message: string;
  user: string | null;
  product: string | null;
  fileName: string | null;
  dataset: string | null;
  severity: string;
  timestamp: string;
}


// --- FUNCIONES DE MAPEO (TRANSFORMADORES) ---

/**
 * Transforma la respuesta cruda de la API de logs en un modelo limpio que la UI puede usar.
 * @param data La respuesta del service (LogsApiResponse)
 * @returns Un array de objetos LogModel.
 */
export const LogsToModel = (data: LogsApiResponse): LogModel[] => {
  // Si no hay logs, devuelve un array vacío para evitar errores.
  if (!data || !data.logs) {
    return [];
  }

  // Mapeamos cada entrada de log cruda a nuestro modelo limpio.
  return data.logs.map((log: LogEntryResponse) => ({
    message: log.message,
    user: log.user,
    product: log.product,
    fileName: log.file_name, // <-- Aquí ocurre la transformación
    dataset: log.dataset,
    severity: log.severity,
    timestamp: log.timestamp,
  }));
};