import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Descomenta si necesitas navegación

import EnvironmentAdapter, {
  EnvironmentModel,
} from "models/Ingest/environment-model";
import { getEnvironmentsService } from "services/Ingest/ingest-service";
import IngestScreen from "screens/Ingest/Ingest";
import { useNavigate } from "react-router";

// --- TIPOS Y ESTADOS ---

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

// Aquí listamos los endpoints que este controlador va a gestionar
export type EndpointName = "GetEnvironments";

export interface IngestModel {
  environments: EnvironmentModel[]; // Nuestra lista limpia de entornos
  lastUpdate: Date | undefined;
}

// --- CONTROLLER ---

const IngestController = () => {
  // const navigate = useNavigate();
  const navigate = useNavigate(); // <--- Hook de navegación

  // 1. Estado del Modelo (Datos)
  const [model, setModel] = useState<Partial<IngestModel>>({
    environments: [], // Inicializamos vacío para evitar undefined
  });

  // 2. Estado de los Endpoints (Carga/Error)
  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  // 3. Carga inicial
  useEffect(() => {
    loadEnvironments();
  }, []);

// --- LÓGICA DE NAVEGACIÓN ---
  const handleSelectEnvironment = (envId: string) => {
    if (envId === "pd") {
      const hostname = window.location.hostname;
      
      console.log("[DEBUG] Hostname detectado:", hostname);

      // 1. Asumimos "dev" por defecto (para localhost, dev cloud, etc.)
      let envSuffix = "dev";

      // 2. Solo si la URL dice explícitamente "-prd-", cambiamos a "prd"
      if (hostname.includes("-prd-")) {
          envSuffix = "prd";
      }

      console.log("[DEBUG] Bucket seleccionado:", `raw-${envSuffix}-osc-manual-bucket`);

      const bucketName = `raw-${envSuffix}-osc-manual-bucket`;
      navigate(`/dashboard/${envId}/${bucketName}/products`);
      
    } else {
      navigate(`/dashboard/${envId}`);
    }
  };

  // --- HELPERS DE ESTADO (Patrón idéntico a tu ejemplo) ---

  const updateModel = (
    partialModel:
      | Partial<IngestModel>
      | ((model: Partial<IngestModel> | undefined) => Partial<IngestModel>)
  ) => {
    setModel((prev) => {
      const newModel =
        typeof partialModel === "function" ? partialModel(prev) : partialModel;

      return {
        ...prev,
        lastUpdate: new Date(),
        ...newModel,
      };
    });
  };

  const setEndpointStatus = (
    endpoint: EndpointName,
    status: Partial<EndpointStatus>
  ) => {
    setEndpoints((prev) => ({
      ...prev,
      [endpoint]: { ...prev?.[endpoint], ...status },
    }));
  };

  const buildStatusEndpoint = (name: EndpointName) => ({
    loading() {
      setEndpointStatus(name, { loading: true, error: false });
    },
    error() {
      setEndpointStatus(name, { loading: false, error: true });
    },
    done() {
      setEndpointStatus(name, { loading: false });
    },
  });

  // --- LÓGICA DE NEGOCIO ---

  const loadEnvironments = async () => {
    const status = buildStatusEndpoint("GetEnvironments");

    try {
      status.loading();

      // 1. Llamada al Servicio (Raw Data)
      const response = await getEnvironmentsService();

      // 2. Adaptador (Clean Data)
      const cleanData = EnvironmentAdapter(response);

      // 3. Actualización del Modelo
      updateModel({ environments: cleanData });
    } catch (e) {
      console.error(e);
      status.error();
      // Opcional: Manejar alertas con snackbar aquí
    } finally {
      status.done();
    }
  };

  // --- RENDER ---

  return (
    <IngestScreen
      model={model}
      endpoints={endpoints}
      onSelectEnvironment={handleSelectEnvironment} // <--- Pasamos la función a la vista
    />
  );
};

export default IngestController;
