import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import FolderAdapter, { FolderModel } from "models/Ingest/folder-model";
import {
  getFoldersService,
  initiateUploadService,
  uploadFileDirectlyService,
  uploadSmallFileService,
  analyzeFileService,
  runProductPipelineService, // Asegúrate de tener este import
} from "services/Ingest/folder-service";
import FolderListScreen from "screens/Ingest/FolderListScreen";

// --- INTERFACES ---

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
  selectedTable: string;
  file: File | null;

  isNewTable: boolean;
  schemaData: any;

  isWizardOpen: boolean;
  currentStep: number;
  stepData: any;
  isLoadingAnalysis: boolean;
  analysisProgress: number;

  isUploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
}

// Nueva interfaz para mensajes de UI (sin usar alerts)
export interface PipelineFeedback {
  type: "success" | "error" | "info" | null;
  message: string | null;
}

const initialUploadState: UploadState = {
  selectedTable: "",
  file: null,
  isNewTable: false,
  schemaData: null,
  isWizardOpen: false,
  currentStep: 1,
  stepData: null,
  isLoadingAnalysis: false,
  analysisProgress: 0,
  isUploading: false,
  uploadProgress: 0,
  uploadSuccess: false,
};

const FolderListController = () => {
  // 1. OBTENCIÓN DE DATOS DESDE LA URL
  const { envId, bucketName, productName } = useParams();
  const navigate = useNavigate();

  // --- ESTADOS ---

  const [model, setModel] = useState<Partial<FolderStateModel>>({
    tables: [],
    envId,
    bucketName,
    productName,
  });

  const [uploadState, setUploadState] =
    useState<UploadState>(initialUploadState);

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  // Estados para el Pipeline (Botón Reprocesar)
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineFeedback, setPipelineFeedback] = useState<PipelineFeedback>({
    type: null,
    message: null,
  });

  // --- EFECTOS ---

  useEffect(() => {
    if (envId && bucketName && productName) {
      loadFolders();
    }
  }, [envId, bucketName, productName]);

  // Limpiar mensajes de feedback después de unos segundos (Opcional, mejora UX)
  useEffect(() => {
    if (pipelineFeedback.message) {
      const timer = setTimeout(() => {
        setPipelineFeedback({ type: null, message: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pipelineFeedback]);

  // --- HELPERS ---

  const setEndpointStatus = (
    name: EndpointName,
    status: Partial<EndpointStatus>
  ) => {
    setEndpoints((prev) => ({
      ...prev,
      [name]: { ...prev?.[name], ...status },
    }));
  };

  const updateModel = (data: Partial<FolderStateModel>) => {
    setModel((prev) => ({ ...prev, ...data }));
  };

  // --- LÓGICA DE NEGOCIO: CARPETAS ---

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

  // --- LÓGICA DE NEGOCIO: PIPELINE (REPROCESAR) ---

  const handleRunPipeline = async () => {
    // Validamos que tengamos los datos necesarios de la URL
    if (!productName) {
      setPipelineFeedback({
        type: "error",
        message: "No se identificó el nombre del producto.",
      });
      return;
    }

    // Limpiamos estados previos
    setIsPipelineRunning(true);
    setPipelineFeedback({ type: "info", message: "Iniciando ejecución..." });

    try {
      // PROYECTO: Como no viene en la URL, usamos el default o mapeamos según envId
      // Si envId es 'sap', quizás el proyecto sea uno, si es 'pd' otro.
      // Por ahora usamos el valor que definimos previamente.
      const PROJECT_ID = "cyt-dev-hq-osc-gcp";

      const response = await runProductPipelineService(productName, PROJECT_ID);

      if (response.status === 200) {
        setPipelineFeedback({
          type: "success",
          message: `Pipeline iniciado correctamente para ${productName}.`,
        });
      } else {
        setPipelineFeedback({
          type: "error",
          message:
            "El servidor respondió, pero hubo un problema iniciando el pipeline.",
        });
      }
    } catch (e: any) {
      console.error("Pipeline Error:", e);
      const errorMsg =
        e.response?.data?.error || "Error de conexión con el servidor.";
      setPipelineFeedback({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setIsPipelineRunning(false);
    }
  };

  // --- LÓGICA DE NEGOCIO: UPLOAD & WIZARD ---

  const handleSelectTableForPreview = (tableName: string) => {
    navigate(
      `/dashboard/${envId}/${bucketName}/${productName}/${tableName}/table`
    );
  };

  const handleBack = () => navigate(-1);

  const handleFileChange = (file: File | null) =>
    setUploadState((p) => ({ ...p, file }));

  const handleTableChange = (tableId: string) =>
    setUploadState((p) => ({ ...p, selectedTable: tableId }));

  const handleSetIsNewTable = (isNew: boolean) => {
    setUploadState((p) => ({ ...p, isNewTable: isNew }));
  };

  const handleStartWizard = () => {
    if (uploadState.file && uploadState.selectedTable) {
      setUploadState((p) => ({
        ...p,
        isWizardOpen: true,
        currentStep: 1,
        uploadSuccess: false,
        stepData: null,
      }));
      loadStepData(1);
    }
  };

  const handleCloseWizard = () => {
    setUploadState((prev) => ({
      ...initialUploadState,
      file: prev.file,
      selectedTable: prev.selectedTable,
      isNewTable: prev.isNewTable,
    }));
  };

  const loadStepData = async (step: number) => {
    const { file, selectedTable, isNewTable } = uploadState;

    if (!file || !envId || !bucketName || !productName || !selectedTable) {
      console.error("Faltan datos para iniciar el análisis");
      return;
    }

    setUploadState((p) => ({
      ...p,
      isLoadingAnalysis: true,
      analysisProgress: 0,
    }));

    const destinationPath = `${productName}/${selectedTable}`;

    try {
      const response = await analyzeFileService(
        file,
        step,
        envId,
        bucketName,
        destinationPath,
        isNewTable,
        (pct) => {
          setUploadState((p) => ({ ...p, analysisProgress: pct }));
        }
      );

      if (response.status === 200) {
        let data = response.data;

        let newSchemaData = uploadState.schemaData;
        if (step === 2 && data.columnas_encontradas) {
          newSchemaData = data.columnas_encontradas;
        }

        if (step === 1) {
          data = {
            ...data,
            producto_dato: productName,
            dataset_destino: selectedTable,
            usuario: "Usuario",
          };
        }

        setUploadState((p) => ({
          ...p,
          stepData: data,
          schemaData: newSchemaData,
          currentStep: step,
          isLoadingAnalysis: false,
        }));
      } else {
        setUploadState((p) => ({ ...p, isLoadingAnalysis: false }));
      }
    } catch (e) {
      console.error(e);
      setUploadState((p) => ({ ...p, isLoadingAnalysis: false }));
    }
  };

  const handleNextStep = () => {
    const next = uploadState.currentStep + 1;
    loadStepData(next);
  };

  const handlePrevStep = () => {
    const prev = uploadState.currentStep - 1;
    loadStepData(prev);
  };

  const handleFinalUpload = async (metadataFromWizard?: any) => {
    const { file, selectedTable, isNewTable, schemaData } = uploadState;

    if (!file || !selectedTable || !envId || !bucketName || !productName)
      return;

    setUploadState((p) => ({ ...p, isUploading: true, uploadProgress: 0 }));

    const SIZE_LIMIT = 300 * 1024 * 1024; // 300MB
    const destinationPath = `${productName}/${selectedTable}`;

    try {
      if (file.size < SIZE_LIMIT) {
        // Subida Rápida (Backend)
        await uploadSmallFileService(
          envId,
          bucketName,
          destinationPath,
          file,
          (pct) => setUploadState((p) => ({ ...p, uploadProgress: pct })),
          isNewTable ? metadataFromWizard : undefined,
          isNewTable ? schemaData : undefined
        );
      } else {
        // Subida Pesada (GCS Directo)
        const initRes = await initiateUploadService(
          envId,
          bucketName,
          destinationPath,
          file.name
        );
        await uploadFileDirectlyService(initRes.sessionUrl, file, (pct) =>
          setUploadState((p) => ({ ...p, uploadProgress: pct }))
        );
      }

      setUploadState((p) => ({
        ...p,
        isUploading: false,
        uploadSuccess: true,
      }));
    } catch (e) {
      console.error(e);
      setUploadState((p) => ({ ...p, isUploading: false }));
    }
  };

  // --- RENDER ---

  return (
    <FolderListScreen
      model={model}
      endpoints={endpoints}
      uploadState={uploadState}
      onSelectTable={handleSelectTableForPreview}
      onBack={handleBack}
      // Props del Form
      onFileChange={handleFileChange}
      onTableChange={handleTableChange}
      setIsNewTable={handleSetIsNewTable}
      onStartWizard={handleStartWizard}
      // Props del Wizard
      onCloseWizard={handleCloseWizard}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
      onFinalUpload={handleFinalUpload}
      // Props Pipeline (NUEVAS)
      onRunPipeline={handleRunPipeline}
      isPipelineRunning={isPipelineRunning}
      pipelineFeedback={pipelineFeedback}
    />
  );
};

export default FolderListController;
