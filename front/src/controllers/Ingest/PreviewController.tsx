import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DatasetAdapter, { DatasetModel } from "models/Ingest/dataset-model";
import { getLatestDatasetPreviewService } from "services/Ingest/dataset-service";
import PreviewScreen from "screens/Ingest/PreviewScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "GetLatestDataset";

export interface UploadStateModel {
  currentFile: DatasetModel; // Usamos el modelo actualizado
  envId: string;
  bucketName: string;
  productName: string;
  tableName: string;
}

const PreviewController = () => {
  const { envId, bucketName, productName, tableName } = useParams();
  const navigate = useNavigate();

  const [model, setModel] = useState<Partial<UploadStateModel>>({
    envId,
    bucketName,
    productName,
    tableName,
  });

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    if (envId && bucketName && productName && tableName) {
      loadData();
    }
  }, [envId, bucketName, productName, tableName]);

  const setEndpointStatus = (
    name: EndpointName,
    status: Partial<EndpointStatus>
  ) => {
    setEndpoints((prev) => ({
      ...prev,
      [name]: { ...prev?.[name], ...status },
    }));
  };

  const updateModel = (data: Partial<UploadStateModel>) => {
    setModel((prev) => ({ ...prev, ...data }));
  };

  const loadData = async () => {
    if (!envId || !bucketName || !productName || !tableName) return;

    setEndpointStatus("GetLatestDataset", { loading: true, error: false });

    try {
      // 1. Llamada al servicio
      const response = await getLatestDatasetPreviewService(
        envId,
        bucketName,
        productName,
        tableName
      );

      // 2. Adaptador (Ahora maneja filas y columnas)
      const cleanData = DatasetAdapter(response);

      updateModel({ currentFile: cleanData });
    } catch (e) {
      console.error(e);
      setEndpointStatus("GetLatestDataset", { error: true });
    } finally {
      setEndpointStatus("GetLatestDataset", { loading: false });
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <PreviewScreen model={model} endpoints={endpoints} onBack={handleBack} />
  );
};

export default PreviewController;
