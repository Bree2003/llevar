import { DatasetPreviewResponse } from "services/Ingest/dataset-service";

// El modelo que usará el frontend
export interface DatasetModel {
  exists: boolean;
  fileName: string;
  headers: string[]; 
  rows: any[];       
  isEmpty: boolean;
}

const DatasetAdapter = (data: DatasetPreviewResponse): DatasetModel => {
  // Caso 1: No existe archivo o hubo error
  if (!data || !data.exists) {
    return {
      exists: false,
      fileName: "Sin archivos previos",
      headers: [],
      rows: [],
      isEmpty: true,
    };
  }

  // Caso 2: Existe archivo, mapeamos la data
  return {
    exists: true,
    fileName: data.fileName || "Archivo",
    headers: data.columns || [], 
    // --- CORRECCIÓN AQUÍ ---
    // El backend envía "rows", así que leemos "rows".
    // Dejamos "data.data" como fallback por si acaso usas la versión vieja del back.
    rows: data.rows || [], 
    isEmpty: false,
  };
};

export default DatasetAdapter;