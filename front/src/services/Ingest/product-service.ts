import { AxiosGet } from "services/utils";

// La respuesta cruda del backend
export interface ProductsResponse {
  data_products: string[];
}

export const getProductsService = async (
  projectId: string, 
  bucketName: string
): Promise<ProductsResponse> => {
  // AxiosGet acepta un segundo argumento para los Query Params (?env_id=...&bucket_name=...)
  const response = await AxiosGet('/api/storage/products', {
    project_id: projectId,
    bucket_name: bucketName
  });

  return response?.data;
};