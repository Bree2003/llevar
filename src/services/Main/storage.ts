// services/storage.ts
import { AxiosGet } from "services/utils";

// 1. Definimos la interfaz para la respuesta CRUDA del backend
export interface EnvironmentResponse {
  id: string;
  name: string;
  project_id: string;
  buckets: string[];
}

// 2. Creamos la función del servicio que llama al endpoint
export const loadEnvironments = async (): Promise<EnvironmentResponse[]> => {
    // Hacemos la llamada a nuestra API de Flask
    const response = await AxiosGet("/api/storage/environments");
    
    // Devolvemos el array de entornos que viene en 'response.data'
    // Añadimos una comprobación por si la respuesta no es un array
    return Array.isArray(response?.data) ? response.data : [];
};