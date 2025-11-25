import { AxiosGet } from "services/utils";

// Definimos la interfaz tal cual viene del Backend
export interface EnvironmentResponse {
  buckets: string[];
  id: string;
  name: string;
  project_id: string;
}

export const getEnvironmentsService = async (): Promise<EnvironmentResponse[]> => {
  // Apuntamos a la ruta específica dentro de la API
  const response = await AxiosGet('/api/storage/environments');
  return response?.data;
};