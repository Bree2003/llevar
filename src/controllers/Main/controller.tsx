// controllers/Main/controller.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainScreen from "screens/Main/Main";

// --- IMPORTACIONES MODIFICADAS ---
import * as storageService from "services/Main/storage";
import * as storageModel from "models/Main/storageModel";

export interface EndpointStatus {
    loading?: boolean;
    error?: boolean;
}

// --- ENDPOINT NAME MODIFICADO ---
export type EndpointName = "LoadEnvironments";

// --- MODELO INTERNO DEL CONTROLLER MODIFICADO ---
export interface Model {
    environments: storageModel.EnvironmentModel[]; // Guardará la lista de entornos
    lastUpdate: Date | undefined;
}

const MainController = () => {

    const navigate = useNavigate();

    const [model, setModel] = useState<Partial<Model>>({ environments: [] }); // Inicializar con array vacío
    const [endpoints, setEndpoints] =
        useState<Partial<Record<EndpointName, EndpointStatus>>>();

    useEffect(() => {
        refreshAllData();
    }, []);

    const refreshAllData = async () => {
        loadEnvironmentsModel(); // Llamamos a la nueva función de carga
    };

    const updateModel = (
        partialModel:
            | Partial<Model>
            | ((model: Partial<Model> | undefined) => Partial<Model>)
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
        loading() { setEndpointStatus(name, { loading: true, error: false }); },
        error() { setEndpointStatus(name, { loading: false, error: true }); },
        done() { setEndpointStatus(name, { loading: false }); },
    });

    const handleViewChange = (data: any, tab: number, url: string) => {
        navigate(`/${url}`, { state: { data: data, tab: tab } });
    };

    // --- FUNCIÓN DE CARGA MODIFICADA ---
    const loadEnvironmentsModel = async () => {
        const statusEndpoint = buildStatusEndpoint("LoadEnvironments");
        try {
            statusEndpoint.loading();
            // 1. Llamar al Service para obtener los entornos
            const response = await storageService.loadEnvironments();
            // 2. Llamar al Model para transformar la respuesta
            const environments = storageModel.EnvironmentsToModel(response);
            // 3. Actualizar el modelo del controlador
            updateModel({ environments });
        } catch (e) {
            console.error("Error al cargar entornos:", e);
            statusEndpoint.error();
            updateModel({ environments: [] });
        } finally {
            statusEndpoint.done();
        }
    };

    return (
        <MainScreen
            model={model}
            endpoints={endpoints}
        />
    );
}

export default MainController;