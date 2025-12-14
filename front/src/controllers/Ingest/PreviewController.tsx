import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack"; // Importamos notistack para feedback visual

import DatasetAdapter, { DatasetModel } from "models/Ingest/dataset-model";
import {
  getLatestDatasetPreviewService,
  saveDatasetDataService,
} from "services/Ingest/dataset-service";
import PreviewScreen from "screens/Ingest/PreviewScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "GetLatestDataset" | "SaveDataset"; // Agregamos SaveDataset

export interface UploadStateModel {
  currentFile: DatasetModel;
  envId: string;
  bucketName: string;
  productName: string;
  tableName: string;
}

const PreviewController = () => {
  const { envId, bucketName, productName, tableName } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Hook para notificaciones

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
      const response = await getLatestDatasetPreviewService(
        envId,
        bucketName,
        productName,
        tableName
      );
      const cleanData = DatasetAdapter(response);
      updateModel({ currentFile: cleanData });
    } catch (e) {
      console.error(e);
      setEndpointStatus("GetLatestDataset", { error: true });
      enqueueSnackbar("Error al cargar los datos.", { variant: "error" });
    } finally {
      setEndpointStatus("GetLatestDataset", { loading: false });
    }
  };

  // --- NUEVA LÓGICA: GUARDAR DATOS ---
  const handleSaveData = async (newRows: any[]) => {
    if (!envId || !bucketName || !productName || !tableName) return;

    setEndpointStatus("SaveDataset", { loading: true, error: false });

    try {
      // 1. Llamada al servicio de guardado
      await saveDatasetDataService(
        envId,
        bucketName,
        productName,
        tableName,
        newRows
      );

      // 2. Feedback al usuario
      enqueueSnackbar("Datos guardados y dataset actualizado exitosamente.", {
        variant: "success",
      });

      // Opcional: Podríamos recargar la data para asegurar sincronía,
      // pero como el front ya tiene los datos actualizados, no es estrictamente necesario.
      // loadData();
    } catch (e) {
      console.error("Error saving data:", e);
      setEndpointStatus("SaveDataset", { error: true });
      enqueueSnackbar("Error al guardar los cambios en la nube.", {
        variant: "error",
      });
    } finally {
      setEndpointStatus("SaveDataset", { loading: false });
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <PreviewScreen
      model={model}
      endpoints={endpoints}
      onBack={handleBack}
      onSave={handleSaveData} // Pasamos la función al screen
    />
  );
};

export default PreviewController;
