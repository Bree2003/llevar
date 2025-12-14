import { AxiosGet, AxiosPost } from "services/utils"; // Asegúrate de importar AxiosPost

// Respuesta del preview
export interface DatasetPreviewResponse {
  exists: boolean;
  fileName?: string;
  columns?: string[];
  rows?: any[];
  error?: string;
}

// Respuesta del guardado
export interface SaveDatasetResponse {
  success: boolean;
  message: string;
  path?: string;
}

export const getLatestDatasetPreviewService = async (
  envId: string, 
  bucketName: string,
  productName: string,
  tableName: string
): Promise<DatasetPreviewResponse> => {
  const path = `${productName}/${tableName}`;
  const response = await AxiosGet(`/api/storage/products/${path}/preview-latest`, {
    env_id: envId,
    bucket_name: bucketName
  });
  return response?.data;
};

// --- NUEVA FUNCIÓN: GUARDAR DATOS ---
export const saveDatasetDataService = async (
  envId: string,
  bucketName: string,
  productName: string,
  tableName: string,
  rows: any[]
): Promise<SaveDatasetResponse> => {
  
  // Construimos el payload exacto que pide el Backend Python
  const payload = {
    env_id: envId,
    bucket_name: bucketName,
    product_name: productName,
    table_name: tableName,
    rows: rows,
    user: "usuario_app" // Podrías pasar el usuario real aquí si lo tienes
  };

  const response = await AxiosPost("/api/storage/products/save-data", payload);
  return response?.data;
};