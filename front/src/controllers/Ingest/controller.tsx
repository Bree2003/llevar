import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Descomenta si necesitas navegación

import EnvironmentAdapter, {
  EnvironmentModel,
} from "models/Ingest/environment-model";
import {
  DomainModel,
  DomainsDataToModel,
} from "models/Global/domainsModel";
import loadDomainsData from "services/Global/get-domains-data";
import { getEnvironmentsService } from "services/Ingest/ingest-service";
import IngestScreen from "screens/Ingest/Ingest";
import { useNavigate } from "react-router";

// --- TIPOS Y ESTADOS ---

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

// Aquí listamos los endpoints que este controlador va a gestionar
export type EndpointName = 
  "GetEnvironments" |
  "loadDomains";

export interface IngestModel {
  environments: EnvironmentModel[]; // Nuestra lista limpia de entornos
  domains: DomainModel[] | undefined;
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
    loadDomains();
  }, []);

  // --- LÓGICA DE NAVEGACIÓN ---
  const handleSelectEnvironment = (projectId: string) => {
      navigate(`/dashboard/${projectId}`);
  };

  const updateModel = (
    partialModel:
      | Partial<IngestModel>
      | ((model: Partial<IngestModel> | undefined) => Partial<IngestModel>),
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
    status: Partial<EndpointStatus>,
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

  const loadDomains = async () => {
    const statusEndpoint = buildStatusEndpoint("loadDomains");
    try {
      statusEndpoint.loading();
      const response = await loadDomainsData();
      const domains = DomainsDataToModel(response);
      updateModel({ domains });
    } catch (e) {
      console.error("Error al cargar dominios:", e);
      statusEndpoint.error();
      updateModel({ domains: [] });
    } finally {
      statusEndpoint.done();
    }
  };

  // --- RENDER ---

  return (
    <IngestScreen
      model={model}
      endpoints={endpoints}
      onSelectEnvironment={handleSelectEnvironment}
    />
  );
};

export default IngestController;
