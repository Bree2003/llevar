// services/Storage/storageService.ts

import { AxiosGet, AxiosDelete } from "services/utils";
import { AxiosPostForm } from "services/utils"; // Importamos nuestra nueva función

// --- TIPOS E INTERFACES ---
// Definir la forma de los datos ayuda a prevenir errores.

// Para GET /products
export interface DataProductsResponse {
  data_products: string[];
}

// Para GET /products/<name>/datasets
export interface DatasetsResponse {
  datasets: string[];
}

// Para POST /analyze (step 1)
export interface AnalyzeStep1Response {
  nombre_archivo: string;
  tamano: string;
  tipo_archivo: string;
  fecha_de_carga: string;
  hora_de_carga: string;
}

// Para POST /analyze (step 2)
export interface AnalyzeStep2Response {
  numero_columnas: number;
  numero_registros: number;
  columnas_encontradas: { nombre: string; tipo: string }[];
  vista_previa: any[];
}

// Para POST /analyze (step 3)
export interface AnalyzeStep3Response {
  alertas: string[];
}

// Para POST /upload y DELETE /delete
export interface MessageResponse {
  message: string;
}


// --- FUNCIONES DEL SERVICIO ---

/**
 * Llama a GET /api/storage/products
 * Obtiene la lista de todos los productos de datos (directorios raíz en el bucket).
 */
export const loadDataProducts = async (): Promise<DataProductsResponse> => {
  const response = await AxiosGet("/api/storage/products");
  if (response.status !== 200) {
    throw new Error(response.data.error || "Error al cargar los productos de datos");
  }
  return response.data;
};

/**
 * Llama a GET /api/storage/products/<product_name>/datasets
 * Obtiene la lista de datasets (archivos) dentro de un producto específico.
 */
export const loadDatasetsInProduct = async (productName: string): Promise<DatasetsResponse> => {
  const response = await AxiosGet(`/api/storage/products/${productName}/datasets`);
  if (response.status !== 200) {
    throw new Error(response.data.error || "Error al cargar los datasets");
  }
  return response.data;
};

/**
 * Llama a POST /api/storage/analyze
 * Envía un archivo y el paso de análisis para obtener su metadata.
 */
export const analyzeFile = async (file: File, step: '1' | '2' | '3') => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("step", step);

  const response = await AxiosPostForm("/api/storage/analyze", formData);
  if (response.status !== 200) {
    throw new Error(response.data.error || `Error en el paso ${step} del análisis`);
  }
  // El tipo de retorno dependerá del paso, el componente que lo llama debe saberlo.
  return response.data as AnalyzeStep1Response | AnalyzeStep2Response | AnalyzeStep3Response;
};

/**
 * Llama a POST /api/storage/upload
 * Sube un archivo al bucket, que será convertido a Parquet.
 * 
 * @param file El archivo a subir.
 * @param productName El nombre del producto de datos (la carpeta en el bucket).
 * @param destinationFilename El nombre base del archivo final (sin extensión).
 * @returns Una promesa con el mensaje de respuesta.
 */
export const uploadFile = async (
  file: File, 
  productName: string, 
  destinationFilename: string
): Promise<MessageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  // Construimos la ruta completa que el backend usará como 'destination'.
  // Ejemplo: "programa_fabricacion/reporte_ventas"
  const fullDestinationPath = `${productName}/${destinationFilename}`;
  
  formData.append("destination", fullDestinationPath);

  const response = await AxiosPostForm("/api/storage/upload", formData);
  
  if (response.status !== 200) {
    throw new Error(response.data.error || "Error al subir el archivo");
  }
  return response.data;
};

/**
 * Llama a GET /api/storage/download/<filename>
 * Descarga un archivo del bucket.
 * NOTA: Esta función requiere una utilidad Axios específica para blobs.
 * Por simplicidad, por ahora construiremos la URL para abrirla directamente.
 */
export const getDownloadFileUrl = (filename: string): string => {
  // Esta es la forma más simple de manejar descargas: construir la URL y usarla en un enlace.
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  return `${backendUrl}/api/storage/download/${encodeURIComponent(filename)}`;
};


/**
 * Llama a DELETE /api/storage/delete/<filename>
 * Elimina un archivo del bucket.
 */
export const deleteFile = async (filename: string): Promise<MessageResponse> => {
  // Nota: AxiosDelete en tu utils.ts envía un body, lo cual está bien pero no es usado por este endpoint.
  const response = await AxiosDelete(`/api/storage/delete/${encodeURIComponent(filename)}`, {});
  if (response.status !== 200) {
    throw new Error(response.data.error || "Error al eliminar el archivo");
  }
  return response.data;
};