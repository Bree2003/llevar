// controllers/Main/controller.tsx
import { useState, useEffect } from "react";
import MainScreen from "screens/Main/Main";
import {
    BannerModel,
    BannersDataToModel
} from "models/Global/bannerModel";
import loadBannerData from "services/Global/get-banner-data";
import * as storageService from "services/Main/storage";
import * as storageModel from "models/Main/storageModel";

export interface EndpointStatus {
    loading?: boolean;
    error?: boolean;
}

export type EndpointName =
    "LoadEnvironments" |
    "loadBanner";

export interface Model {
    environments: storageModel.EnvironmentModel[];
    banners: BannerModel[] | undefined;
    lastUpdate: Date | undefined;
}

const MainController = () => {
    const [model, setModel] = useState<Partial<Model>>({ environments: [] });
    const [endpoints, setEndpoints] = useState<Partial<Record<EndpointName, EndpointStatus>>>();

    useEffect(() => {
        refreshAllData();
    }, []);

    const refreshAllData = async () => {
        loadEnvironmentsModel();
        loadBanners();
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

    const loadBanners = async () => {
        const statusEndpoint = buildStatusEndpoint("loadBanner");
        try {
            statusEndpoint.loading();
            const response = await loadBannerData();
            const banners = BannersDataToModel(response);
            updateModel({ banners });
        } catch (e) {
            console.error("Error al cargar banners:", e);
            statusEndpoint.error();
            updateModel({ banners: [] });
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