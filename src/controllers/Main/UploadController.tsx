// controllers/Main/UploadController.tsx
import { useState, useEffect } from "react";

// Importaciones de Redux y Estado Global
import { useAppDispatch, useAppSelector } from "store/hooks/redux-hooks";
import { loadEnvironments } from "store/actions/gcsData";

import UploadScreen from "screens/Main/UploadScreen";
import { generateUploadUrlService, generateUploadUrlTestService, GenerateUrlParams, getProductsService, getSubfoldersService, initiateResumableUploadService, InitiateUploadParams, UploadFileParams, uploadFileResumableService, uploadFileService, uploadFileWithSignedUrlService } from "services/gcs-data-service";
import { InitiateUploadResponseToModel, ProductsResponseToModel, SubfoldersResponseToModel, UploadFileResponseToModel } from "models/Main/gcs-data-model";
// --- DEFINICIÓN DE ESTADOS ---

export type EndpointName =
  | "loadProducts"
  | "loadTables"
  | "uploadFile";

export interface EndpointStatus {
  loading: boolean;
  error: boolean;
  errorMessage?: string;
}

export interface UploadModel {
  selectedEnvId: string;
  selectedBucket: string;
  products: string[];
  tables: string[];
  breadcrumbs: string[];
  fileToUpload?: File;
}

const UploadController = () => {
  const dispatch = useAppDispatch();

  const { environments, loading: environmentsLoading } = useAppSelector(
    (state) => state.GcsData
  );

  const [model, setModel] = useState<Partial<UploadModel>>({
    breadcrumbs: [],
    products: [],
    tables: [],
  });
  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    dispatch(loadEnvironments());
  }, [dispatch]);

  const updateModel = (partialModel: Partial<UploadModel>) => {
    setModel((prev) => ({ ...prev, ...partialModel }));
  };

  const buildStatusEndpoint = (name: EndpointName) => ({
    loading: () => setEndpoints((prev) => ({ ...prev, [name]: { loading: true, error: false } })),
    error: (errorMessage: string) => setEndpoints((prev) => ({ ...prev, [name]: { loading: false, error: true, errorMessage } })),
    done: () => setEndpoints((prev) => ({ ...prev, [name]: { loading: false, error: false } })),
  });

  // --- LÓGICA DE CARGA DE DATOS (MODIFICADA) ---

  const loadProducts = async (env_id: string, bucket_name: string) => {
    const status = buildStatusEndpoint("loadProducts");
    status.loading();
    try {
      const response = await getProductsService({ env_id, bucket_name });
      if (response.status === 200) {
        const products = ProductsResponseToModel(response.data);
        // La función de carga solo se preocupa de actualizar los datos que cargó.
        updateModel({ products });
        status.done();
      } else {
        status.error(response.data.error || "Error al cargar productos.");
        updateModel({ products: [] }); // En caso de error, asegurar que la lista esté vacía.
      }
    } catch (e: any) {
      status.error(e.message);
      updateModel({ products: [] });
    }
  };

  const loadTables = async (path: string) => {
    if (!model.selectedEnvId || !model.selectedBucket) return;
    const status = buildStatusEndpoint("loadTables");
    status.loading();
    try {
      const response = await getSubfoldersService(path, {
        env_id: model.selectedEnvId,
        bucket_name: model.selectedBucket,
      });
      if (response.status === 200) {
        const tables = SubfoldersResponseToModel(response.data);
        // Solo actualiza las tablas
        updateModel({ tables });
        status.done();
      } else {
        status.error(response.data.error || "Error al cargar tablas.");
        updateModel({ tables: [] });
      }
    } catch (e: any) {
      status.error(e.message);
      updateModel({ tables: [] });
    }
  };
  
  // --- MANEJADORES DE EVENTOS (MODIFICADOS) ---

  const handleEnvChange = (envId: string) => {
    updateModel({
      selectedEnvId: envId,
      selectedBucket: undefined,
      products: [],
      tables: [],
      breadcrumbs: [],
    });
  };

  const handleBucketChange = (bucketName: string) => {
    if (!model.selectedEnvId) return;
    // 1. Resetea el estado de la navegación INMEDIATAMENTE.
    //    Esto asegura que la UI se limpie antes de la llamada a la API.
    updateModel({
      selectedBucket: bucketName,
      products: [],
      tables: [],
      breadcrumbs: [],
    });
    // 2. Lanza la carga de los nuevos datos.
    loadProducts(model.selectedEnvId, bucketName);
  };

  const handleRootClick = () => {
    // Esta función ahora hace lo mismo que cambiar el bucket.
    if (!model.selectedBucket) return;
    handleBucketChange(model.selectedBucket);
  };

  const handleFolderClick = (folderName: string) => {
    const newBreadcrumbs = [...(model.breadcrumbs || []), folderName];
    // Resetea las listas antes de cargar los nuevos datos
    updateModel({ breadcrumbs: newBreadcrumbs, products: [], tables: [] });
    loadTables(newBreadcrumbs.join("/"));
  };
  
  const handleBreadcrumbClick = (index: number) => {
    if (!model.selectedEnvId || !model.selectedBucket) return;
    const newBreadcrumbs = (model.breadcrumbs || []).slice(0, index + 1);
    // Resetea las listas antes de cargar los nuevos datos
    updateModel({ breadcrumbs: newBreadcrumbs, products: [], tables: [] });
    loadTables(newBreadcrumbs.join("/"));
  };
  
  const handleFileSelect = (file: File | undefined) => {
    updateModel({ fileToUpload: file });
  };
  
  const handleUploadFile = async () => {
    if (!model.selectedEnvId || !model.selectedBucket || !model.fileToUpload || !model.breadcrumbs?.length) {
        alert("Por favor, seleccione un entorno, un bucket, una tabla de destino y un archivo.");
        return;
    }
    
    const status = buildStatusEndpoint("uploadFile");
    status.loading();
    
    const file = model.fileToUpload;

    const params: InitiateUploadParams = {
        env_id: model.selectedEnvId,
        bucket_name: model.selectedBucket,
        destination: model.breadcrumbs.join("/"),
        fileName: file.name,
    };

    try {
        // --- PASO 1: Iniciar la sesión de subida con nuestro backend ---
        const sessionResponse = await initiateResumableUploadService(params);
        
        if (sessionResponse.status !== 200) {
            status.error(sessionResponse.data.error || "No se pudo iniciar la sesión de subida.");
            return;
        }

        const { sessionUrl, finalPath } = InitiateUploadResponseToModel(sessionResponse.data);

        // --- PASO 2: Subir el archivo directamente a GCS usando la URL de sesión ---
        const uploadResponse = await uploadFileResumableService(sessionUrl, file);

        if (uploadResponse.status === 200) {
            alert(`Éxito: Archivo subido a ${finalPath}`);
            updateModel({ fileToUpload: undefined }); // Limpiar archivo seleccionado
            status.done();
        } else {
            status.error("Falló la subida directa a Google Cloud Storage.");
        }

    } catch(e: any) {
        status.error(e.message);
    }
  };

  return (
    <UploadScreen
      environments={environments}
      environmentsLoading={environmentsLoading}
      model={model}
      endpoints={endpoints}
      onEnvChange={handleEnvChange}
      onBucketChange={handleBucketChange}
      onFolderClick={handleFolderClick}
      onBreadcrumbClick={handleBreadcrumbClick}
      onRootClick={handleRootClick}
      onFileSelect={handleFileSelect}
      onUploadFile={handleUploadFile}
    />
  );
};

export default UploadController;