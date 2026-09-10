import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import * as storageService from "services/Main/storage";
import * as storageModel from "models/Main/storageModel";

import { LinksModel, LinksDataToModel } from "models/Global/linksModel";

import loadLinksData from "services/Global/get-links-data";

import OnboardingScreen from "screens/Main/Onboarding/Onboarding";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "LoadEnvironments" | "LoadLinks";

export interface Model {
  environments: storageModel.EnvironmentModel[];
  links: LinksModel | undefined;
  lastUpdate: Date | undefined;
}

const OnboardingController = () => {
  const navigate = useNavigate();

  const [model, setModel] = useState<Partial<Model>>({
    environments: [],
    links: undefined,
  });

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    loadEnvironmentsModel();
    loadLinksModel();
  };

  const updateModel = (
    partialModel:
      | Partial<Model>
      | ((model: Partial<Model> | undefined) => Partial<Model>),
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
      [endpoint]: {
        ...prev?.[endpoint],
        ...status,
      },
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
      setEndpointStatus(name, {
        loading: false,
      });
    },
  });

  const handleViewChange = (data: any, tab: number, url: string) => {
    navigate(`/${url}`, {
      state: {
        data,
        tab,
      },
    });
  };

  const loadEnvironmentsModel = async () => {
    const statusEndpoint = buildStatusEndpoint("LoadEnvironments");

    try {
      statusEndpoint.loading();

      const response = await storageService.loadEnvironments();

      const environments = storageModel.EnvironmentsToModel(response);

      updateModel({
        environments,
      });
    } catch (e) {
      console.error("Error al cargar entornos:", e);

      statusEndpoint.error();

      updateModel({
        environments: [],
      });
    } finally {
      statusEndpoint.done();
    }
  };

  const loadLinksModel = async () => {
    const statusEndpoint = buildStatusEndpoint("LoadLinks");

    try {
      statusEndpoint.loading();

      const response = await loadLinksData();

      const links = LinksDataToModel(response);

      updateModel({
        links: links ?? undefined,
      });
    } catch (e) {
      console.error("Error al cargar enlaces:", e);

      statusEndpoint.error();

      updateModel({
        links: undefined,
      });
    } finally {
      statusEndpoint.done();
    }
  };

  return <OnboardingScreen links={model.links} />;
};

export default OnboardingController;
