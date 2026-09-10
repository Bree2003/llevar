import { useState } from "react";
import AgentScreen from "screens/Agent/AgentScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "loadSomething";

export interface Model {
  lastUpdate: Date | undefined;
}

const AgentController = () => {
  const [model, setModel] = useState<Partial<Model>>();
  const [endpoints, setEndpoints] = useState<Partial<Record<EndpointName, EndpointStatus>>>();

  const updateModel = (
    partialModel:
      | Partial<Model>
      | ((model: Partial<Model> | undefined) => Partial<Model>),
  ) => {
    setModel((previous) => {
      const newModel =
        typeof partialModel === "function"
          ? partialModel(previous)
          : partialModel;

      return {
        ...previous,
        lastUpdate: new Date(),
        ...newModel,
      };
    });
  };

  const setEndpointStatus = (
    endpoint: EndpointName,
    status: Partial<EndpointStatus>,
  ) => {
    setEndpoints((previous) => ({
      ...previous,

      [endpoint]: {
        ...previous?.[endpoint],
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

  return (
    <AgentScreen />
  );
};

export default AgentController;
