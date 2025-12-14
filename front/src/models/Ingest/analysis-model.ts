// Paso 1: Metadata
export interface AnalysisStep1Data {
  nombre_archivo: string;
  tamano: string;
  tipo_archivo: string;
  fecha_de_carga: string;
  hora_de_carga: string;
}

// Paso 2: Estructura
export interface ColumnDefinition {
  nombre: string;
  tipo: string;
}

export interface AnalysisStep2Data {
  numero_columnas: number;
  numero_registros: number;
  columnas_encontradas: ColumnDefinition[];
  vista_previa: any[]; // Array de objetos
}

// Paso 3: Validación
export interface AnalysisStep3Data {
  alertas: string[];
}

// Tipo Unión para el estado del controller
export type AnalysisData = AnalysisStep1Data | AnalysisStep2Data | AnalysisStep3Data | null;