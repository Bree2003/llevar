import { AxiosGet } from "services/utils";

// La respuesta completa que viene del nuevo endpoint Python
export interface DatasetPreviewResponse {
  exists: boolean;
  fileName?: string;
  columns?: string[]; // Nombres de las columnas
  data?: any[];       // Array de objetos con la data
  error?: string;
}

export const getLatestDatasetPreviewService = async (
  envId: string, 
  bucketName: string,
  productName: string,
  tableName: string
): Promise<DatasetPreviewResponse> => {
  
  const path = `${productName}/${tableName}`;
  
  // Llamamos al endpoint de preview
  const response = await AxiosGet(`/api/storage/products/${path}/preview-latest`, {
    env_id: envId,
    bucket_name: bucketName
  });

  return response?.data;
};