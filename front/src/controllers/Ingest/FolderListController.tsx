import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import FolderAdapter, { FolderModel } from "models/Ingest/folder-model";
import {
  getFoldersService,
  initiateUploadService,
  uploadFileDirectlyService,
  uploadSmallFileService,
} from "services/Ingest/folder-service";
import FolderListScreen from "screens/Ingest/FolderListScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "GetFolders" | "UploadFile";

export interface FolderStateModel {
  tables: FolderModel[];
  envId: string;
  bucketName: string;
  productName: string;
}

export interface UploadState {
  isOpen: boolean; // Ya no se usa para un modal, pero lo mantenemos por si acaso
  selectedTable: string;
  file: File | null;
  progress: number;
  isUploading: boolean;
  uploadSuccess: boolean;
}

// --- PASO 1: Definimos el estado inicial como una constante FUERA del componente ---
// Esto resuelve el error y hace que el estado sea fácilmente reseteable.
const initialUploadState: UploadState = {
  isOpen: false,
  selectedTable: "",
  file: null,
  progress: 0,
  isUploading: false,
  uploadSuccess: false,
};

const FolderListController = () => {
  const { envId, bucketName, productName } = useParams();
  const navigate = useNavigate();

  const [model, setModel] = useState<Partial<FolderStateModel>>({
    tables: [],
    envId,
    bucketName,
    productName,
  });

  // --- PASO 2: Usamos la constante para inicializar el estado ---
  const [uploadState, setUploadState] = useState<UploadState>(initialUploadState);

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    if (envId && bucketName && productName) {
      loadFolders();
    }
  }, [envId, bucketName, productName]);

  // Funciones helper (sin cambios)
  const setEndpointStatus = (name: EndpointName, status: Partial<EndpointStatus>) => {
    setEndpoints((prev) => ({ ...prev, [name]: { ...prev?.[name], ...status } }));
  };
  const updateModel = (data: Partial<FolderStateModel>) => {
    setModel((prev) => ({ ...prev, ...data }));
  };

  const loadFolders = async () => {
    if (!envId || !bucketName || !productName) return;
    setEndpointStatus("GetFolders", { loading: true, error: false });
    try {
      const response = await getFoldersService(envId, bucketName, productName);
      const cleanTables = FolderAdapter(response);
      updateModel({ tables: cleanTables });
    } catch (e) {
      console.error(e);
      setEndpointStatus("GetFolders", { error: true });
    } finally {
      setEndpointStatus("GetFolders", { loading: false });
    }
  };

  // Navegación (sin cambios)
  const handleSelectTableForPreview = (tableName: string) => {
    navigate(`/${envId}/${bucketName}/${productName}/${tableName}/preview`);
  };
  const handleBack = () => navigate(-1);

  // --- LÓGICA DEL FORMULARIO DE UPLOAD (ACTUALIZADA) ---

  // --- PASO 3: Eliminamos 'toggleUploadModal' que ya no es necesaria ---

  const handleFileChange = (file: File | null) => {
    setUploadState((prev) => ({ ...prev, file }));
  };

  const handleTableChange = (tableId: string) => {
    setUploadState((prev) => ({ ...prev, selectedTable: tableId }));
  };

  const handleUpload = async () => {
    // La lógica de esta función es compleja y está correcta, no la tocamos.
    const { file, selectedTable } = uploadState;
    if (!file || !selectedTable || !envId || !bucketName || !productName) return;

    setUploadState((prev) => ({ ...prev, isUploading: true, progress: 0 }));
    setEndpointStatus("UploadFile", { loading: true, error: false });

    const SIZE_LIMIT = 300 * 1024 * 1024;
    const destinationPath = `${productName}/${selectedTable}`;

    try {
      if (file.size < SIZE_LIMIT) {
        await uploadSmallFileService(envId, bucketName, destinationPath, file, (percent) =>
          setUploadState((prev) => ({ ...prev, progress: percent }))
        );
      } else {
        const initResponse = await initiateUploadService(envId, bucketName, destinationPath, file.name);
        await uploadFileDirectlyService(initResponse.sessionUrl, file, (percent) =>
          setUploadState((prev) => ({ ...prev, progress: percent }))
        );
      }

      setUploadState((prev) => ({ ...prev, isUploading: false, uploadSuccess: true }));
    } catch (error) {
      console.error("Error subiendo archivo", error);
      setUploadState((prev) => ({ ...prev, isUploading: false, progress: 0 }));
      setEndpointStatus("UploadFile", { error: true });
    } finally {
      setEndpointStatus("UploadFile", { loading: false });
    }
  };

  // --- PASO 4: Corregimos la función de reseteo ---
  // Ahora simplemente vuelve a establecer el estado a su valor inicial.
  const handleResetUpload = () => {
    setUploadState(initialUploadState);
  };

  return (
    <FolderListScreen
      model={model}
      endpoints={endpoints}
      uploadState={uploadState}
      onSelectTable={handleSelectTableForPreview}
      onBack={handleBack}
      // --- PASO 5: Limpiamos las props y pasamos las correctas ---
      onResetUpload={handleResetUpload} // La nueva función de reseteo
      onFileChange={handleFileChange}
      onTableChange={handleTableChange}
      onUpload={handleUpload}
    />
  );
};

export default FolderListController;