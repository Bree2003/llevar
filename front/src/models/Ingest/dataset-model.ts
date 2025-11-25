import { DatasetPreviewResponse } from "services/Ingest/dataset-service";

// El modelo que usará el frontend
export interface DatasetModel {
  exists: boolean;
  fileName: string;
  headers: string[]; // Para la tabla
  rows: any[];       // Para la tabla
  isEmpty: boolean;
}

const DatasetAdapter = (data: DatasetPreviewResponse): DatasetModel => {
  // Caso 1: No existe archivo o hubo error
  if (!data || !data.exists || !data.fileName) {
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
    fileName: data.fileName,
    headers: data.columns || [], // El backend nos manda "columns"
    rows: data.data || [],       // El backend nos manda "data"
    isEmpty: false,
  };
};

export default DatasetAdapter;