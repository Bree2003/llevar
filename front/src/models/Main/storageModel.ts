// models/storageModel.ts
import { EnvironmentResponse } from "services/Main/storage";

// 1. Definimos la interfaz del modelo INTERNO de la aplicación.
//    En este caso, es idéntica a la de la respuesta, pero podría ser diferente.
export interface EnvironmentModel { 
    id: string;
    name: string;
}

// 2. Creamos la función de transformación
export const EnvironmentsToModel = (data: EnvironmentResponse[]): EnvironmentModel[] => {
    // Si no recibimos datos, devolvemos un array vacío para evitar errores
    if (!data) return [];
    
    // Usamos .map para transformar cada objeto de la respuesta en nuestro modelo.
    // Solo nos quedamos con 'id' y 'name' porque es lo único que la UI necesita mostrar.
    const output: EnvironmentModel[] = data.map(env => ({
        id: env.id,
        name: env.name,
    }));
    
    return output;
}