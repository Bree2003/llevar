import { useEffect, useState } from "react";

import {
  DictionaryModel,
  DictionariesDataToModel,
} from "models/Global/dictionaryModel";

import loadDictionaryData from "services/Global/get-dictionary-data";

import ConceptosScreen from "screens/Main/Conceptos/Conceptos";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "loadDictionary";

export interface Model {
  dictionaries: DictionaryModel[] | undefined;

  lastUpdate: Date | undefined;
}

const ConceptosController = () => {
  const [model, setModel] = useState<Partial<Model>>({
    dictionaries: undefined,
  });

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    loadDictionaries();
  }, []);

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

  const loadDictionaries = async () => {
    const statusEndpoint = buildStatusEndpoint("loadDictionary");

    try {
      statusEndpoint.loading();

      const response = await loadDictionaryData();

      const dictionaries = DictionariesDataToModel(response);

      updateModel({
        dictionaries,
      });
    } catch (error) {
      console.error("Error al cargar diccionario:", error);

      statusEndpoint.error();

      updateModel({
        dictionaries: [],
      });
    } finally {
      statusEndpoint.done();
    }
  };

  return (
    <ConceptosScreen
      dictionaryData={model?.dictionaries}
      isLoading={endpoints?.loadDictionary?.loading ?? true}
      hasError={endpoints?.loadDictionary?.error ?? false}
    />
  );
};

export default ConceptosController;
