import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  BucketModel,
  BucketDataToModel,
} from "models/Ingest/buckets-model";
import EnvironmentAdapter from "models/Ingest/environment-model";
import { getBucketsService } from "services/Ingest/get-buckets-service";
import { getEnvironmentsService } from "services/Ingest/ingest-service";
import BucketListScreen from "screens/Ingest/BucketListScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "GetBuckets";

export interface BucketListModel {
  environmentName: string;
  buckets: BucketModel[];
};

const BucketListController = () => {
  const { envId } = useParams();
  const navigate = useNavigate();

  const [model, setModel] = useState<Partial<BucketListModel>>({
    buckets: [],
  });

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    if (envId) {
      updateModel({ environmentName: envId });
      loadBuckets(envId);
    }
  }, [envId]);

  const updateModel = (data: Partial<BucketListModel>) => {
    setModel((prev) => ({ ...prev, ...data }));
  };

  const setEndpointStatus = (
    name: EndpointName,
    status: Partial<EndpointStatus>
  ) => {
    setEndpoints((prev) => ({
      ...prev,
      [name]: { ...prev?.[name], ...status },
    }));
  };

  const loadBuckets = async (project_id: string) => {
    setEndpointStatus("GetBuckets", { loading: true, error: false });

    try {
      const response = await getBucketsService(project_id);
      const buckets = BucketDataToModel(response);
      updateModel({ buckets });
    } catch (e) {
      console.error(e);
      updateModel({ buckets: []});
      setEndpointStatus("GetBuckets", { error: true });
    } finally {
      setEndpointStatus("GetBuckets", { loading: false });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // --- NUEVO: Función para navegar al siguiente nivel ---
  const handleSelectBucket = (bucketName: string, kind: string) => {
    if (kind === "sap") {
      // Ruta específica para SAP
      navigate(`/dashboard/${envId}/${bucketName}/manual/folders`);
    } else if (kind === "manual") {
      // Ruta específica para PD
      navigate(`/dashboard/${envId}/${bucketName}/products`);
    }
    // Opcional: Puedes agregar un else final por si envId es otra cosa
  };

  return (
    <BucketListScreen
      model={model}
      endpoints={endpoints}
      onBack={handleBack}
      onSelectBucket={handleSelectBucket} // <--- Pasamos la prop nueva
    />
  );
};

export default BucketListController;
