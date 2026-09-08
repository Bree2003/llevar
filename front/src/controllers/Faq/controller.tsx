import { useEffect, useState } from "react";

import { FaqModel, FaqsDataToModel } from "models/Global/faqModel";

import loadFaqData from "services/Global/get-faq-data";

import FaqScreen from "screens/Main/Faq/Faq";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "loadFaq";

export interface Model {
  faqs: FaqModel[] | undefined;
  lastUpdate: Date | undefined;
}

const FaqController = () => {
  const [model, setModel] = useState<Partial<Model>>({
    faqs: undefined,
  });

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    loadFaqs();
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

  const loadFaqs = async () => {
    const statusEndpoint = buildStatusEndpoint("loadFaq");

    try {
      statusEndpoint.loading();

      const response = await loadFaqData();

      const faqs = FaqsDataToModel(response);

      updateModel({
        faqs,
      });
    } catch (error) {
      console.error("Error al cargar preguntas frecuentes:", error);

      statusEndpoint.error();

      updateModel({
        faqs: [],
      });
    } finally {
      statusEndpoint.done();
    }
  };

  return (
    <FaqScreen
      faqData={model?.faqs}
      isLoading={endpoints?.loadFaq?.loading ?? true}
      hasError={endpoints?.loadFaq?.error ?? false}
    />
  );
};

export default FaqController;
