// store/models/gcsData.ts

// Esta interfaz describe la estructura de un solo entorno,
// tal como la devuelve tu API en /environments.
export interface EnvironmentModel {
  id: string;
  name: string;
  project_id: string; // Lo incluimos aunque el front no lo use directamente
  buckets: string[];
}

// Esta interfaz describe cómo se verá este "slice" de nuestro estado global en Redux.
export interface GcsDataState {
  environments: EnvironmentModel[];
  loading: boolean;
}

// Esta interfaz describe la forma de las acciones que enviaremos a nuestro reducer.
export interface GcsDataAction {
  type: string;
  payload?: EnvironmentModel[]; // El payload será una lista de entornos
}