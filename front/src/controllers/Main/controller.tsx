import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainScreen from "screens/Main/Main";

import ExampleDataToModel from "models/Main/modelExample";
import loadExampleData from "services/Main/get-example-data";


export interface EndpointStatus {
    loading: boolean;
    error: boolean;
}

export type EndpointName =
    "Endpoint1" |
    "Endpoint2";

export interface Model {
    modelExample: any;
    lastUpdate: Date | undefined;
}

const MainController = () => {

    const navigate = useNavigate();

    const [model, setModel] = useState<Partial<Model>>();
    const [endpoints, setEndpoints] =
        useState<Partial<Record<EndpointName, EndpointStatus>>>();

    useEffect(() => {
        refreshAllData();
    }, []);

    const refreshAllData = async () => {
        loadExampleModel();
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
        loading() {
            setEndpointStatus(name, {
                loading: true,
                error: false,
            });
        },
        error() {
            setEndpointStatus(name, {
                loading: false,
                error: true,
            });
        },
        done() {
            setEndpointStatus(name, { loading: false });
        },
    });

    const handleViewChange = (data: any, tab: number, url: string) => {
        navigate(`/${url}`, { state: { data: data, tab: tab } });
    };

    const loadExampleModel = async () => {
        const statusEndpoint = buildStatusEndpoint("Endpoint1");
        try {
            statusEndpoint.loading();
            const response = await loadExampleData();
            const modelExample = ExampleDataToModel(response);
            updateModel({ modelExample });
        } catch (e) {
            statusEndpoint.error();
            updateModel({ modelExample: undefined });
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
