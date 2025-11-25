import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import EnvironmentAdapter from "models/Ingest/environment-model";
import { getEnvironmentsService } from "services/Ingest/ingest-service";
import BucketListScreen from "screens/Ingest/BucketListScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "GetBuckets";

export interface BucketListModel {
  environmentName: string;
  buckets: string[];
}

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
      loadBuckets();
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

  const loadBuckets = async () => {
    setEndpointStatus("GetBuckets", { loading: true, error: false });

    try {
      const response = await getEnvironmentsService();
      const allEnvs = EnvironmentAdapter(response);
      const selectedEnv = allEnvs.find((env) => env.id === envId);

      if (selectedEnv) {
        updateModel({
          environmentName: selectedEnv.label,
          buckets: selectedEnv.buckets,
        });
      } else {
        console.error("Entorno no encontrado");
        setEndpointStatus("GetBuckets", { error: true });
      }
    } catch (e) {
      console.error(e);
      setEndpointStatus("GetBuckets", { error: true });
    } finally {
      setEndpointStatus("GetBuckets", { loading: false });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // --- NUEVO: Función para navegar al siguiente nivel ---
  const handleSelectBucket = (bucketName: string) => {
    // Construimos la ruta dinámica: /sap/raw-bucket/products
    if (envId) {
      navigate(`/${envId}/${bucketName}/products`);
    }
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
