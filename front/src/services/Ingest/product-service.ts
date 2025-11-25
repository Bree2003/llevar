import { AxiosGet } from "services/utils";

// La respuesta cruda del backend
export interface ProductsResponse {
  data_products: string[];
}

export const getProductsService = async (
  envId: string, 
  bucketName: string
): Promise<ProductsResponse> => {
  // AxiosGet acepta un segundo argumento para los Query Params (?env_id=...&bucket_name=...)
  const response = await AxiosGet('/api/storage/products', {
    env_id: envId,
    bucket_name: bucketName
  });

  return response?.data;
};