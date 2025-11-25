// controllers/Main/controller.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainScreen from "screens/Main/Main";

import * as storageService from "services/Main/storage";
import * as storageModel from "models/Main/storageModel";

export interface EndpointStatus {
    loading?: boolean;
    error?: boolean;
}

export type EndpointName = "LoadEnvironments";

export interface Model {
    environments: storageModel.EnvironmentModel[];
    lastUpdate: Date | undefined;
}

const MainController = () => {

    const navigate = useNavigate();

    // --- NOTA: Esta lógica ahora no se usa en la vista, pero se mantiene aquí ---
    // --- por si se necesita para otros componentes en el futuro. ---
    const [model, setModel] = useState<Partial<Model>>({ environments: [] });
    const [endpoints, setEndpoints] =
        useState<Partial<Record<EndpointName, EndpointStatus>>>();

    useEffect(() => {
        refreshAllData();
    }, []);

    const refreshAllData = async () => {
        loadEnvironmentsModel();
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



    const loadEnvironmentsModel = async () => {
        const statusEndpoint = buildStatusEndpoint("LoadEnvironments");
        try {
            statusEndpoint.loading();
            const response = await storageService.loadEnvironments();
            const environments = storageModel.EnvironmentsToModel(response);
            updateModel({ environments });
        } catch (e) {
            console.error("Error al cargar entornos:", e);
            statusEndpoint.error();
            updateModel({ environments: [] });
        } finally {
            statusEndpoint.done();
        }
    };

    // --- CAMBIO CLAVE: Llamamos a MainScreen sin pasarle ninguna prop ---
    return (
        <MainScreen />
    );
}

export default MainController;