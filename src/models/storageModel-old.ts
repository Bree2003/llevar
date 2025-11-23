// model/Storage/StorageModel.ts
// --- INTERFACES DEL MODELO ---
// Estas son las estructuras de datos "limpias" que usará tu aplicación.

import { DataProductsResponse, DatasetsResponse } from "services/storage-old";

export interface DataProductModel {
  // Por ahora, un producto es solo un string, pero podríamos enriquecerlo después.
  // Por ejemplo: { name: string; id: number; }
  // Por ahora, lo mantenemos simple.
  name: string;
}

export interface DatasetModel {
  name: string;
}

// Podríamos crear modelos para los pasos de análisis también, pero empecemos con estos.


// --- FUNCIONES DE MAPEO (TRANSFORMADORES) ---

/**
 * Transforma la respuesta cruda de la API de productos
 * en un modelo limpio que la UI puede usar.
 * @param data La respuesta del service (DataProductsResponse)
 * @returns Un array de strings con los nombres de los productos.
 */
export const DataProductsToModel = (data: DataProductsResponse): string[] => {
  // La respuesta cruda es { data_products: ["prod1", "prod2"] }
  // El modelo que queremos es solo el array: ["prod1", "prod2"]
  return data.data_products || []; // Devolvemos un array vacío si no viene nada.
};

/**
 * Transforma la respuesta cruda de la API de datasets
 * en un modelo limpio.
 * @param data La respuesta del service (DatasetsResponse)
 * @returns Un array de strings con los nombres de los datasets.
 */
export const DatasetsToModel = (data: DatasetsResponse): string[] => {
  // La respuesta cruda es { datasets: ["d1.parquet", "d2.parquet"] }
  // El modelo que queremos es solo el array.
  return data.datasets || [];
};

// ... Aquí podrías añadir más mapeadores para las respuestas de /analyze si es necesario.