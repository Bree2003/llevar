import { useParams } from "react-router-dom";
import {
  EndpointName,
  EndpointStatus,
  FolderStateModel,
  UploadState,
  PipelineFeedback,
} from "controllers/Ingest/FolderListController";
import ResumenProducto from "components/ResumenProducto/ResumenProducto";
import ProductSidebar from "components/DataProduct/ProductSidebar";
import FileUploadSection from "components/DataProduct/FileUploadSection";
import WizardModal from "components/Ingest/Wizard/WizardModal";
import PipelineButton from "components/DataProduct/PipelineButton";

const FeedbackToast = ({ feedback }: { feedback: PipelineFeedback }) => {
  if (!feedback.message) return null;

  const type = feedback.type || "info";

  const styles: Record<string, string> = {
    success: "border-l-green-500 text-green-600",
    error: "border-l-red-500 text-red-600",
    info: "border-l-blue-500 text-blue-600",
  };

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

 return (
    <div
      className={`fixed top-5 right-5 z-[9999] min-w-96 px-4 py-3 bg-white rounded shadow-lg border border-gray-100 border-l-4 animate-fade-in-down flex items-start gap-3 max-w-sm ${styles[type]}`}
    >
      <span className="text-xl font-bold leading-none mt-0.5">
        {icon[type]}
      </span>
      <div>
        <p className="font-bold text-gray-800 text-sm capitalize">
          {type === "success" ? "Iniciado" : type === "error" ? "Error" : "Información"}
        </p>
        <p className="text-sm text-gray-600 mt-1">{feedback.message}</p>
      </div>
    </div>
  );
};


interface Props {
  model: Partial<FolderStateModel>;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  uploadState: UploadState;
  onSelectTable: (tableName: string) => void;
  onBack: () => void;
  onFileChange: (file: File | null) => void;
  onTableChange: (tableId: string) => void;
  onStartWizard: () => void;
  setIsNewTable: (isNew: boolean) => void;
  onCloseWizard: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFinalUpload: (metadata?: any) => void;

  onRunPipeline: () => void;
  isPipelineRunning: boolean;
  pipelineFeedback: PipelineFeedback;

  showCuadraturaModal: boolean;
  setShowCuadraturaModal: (v: boolean) => void;
}

const FolderListScreen = ({
  model,
  endpoints,
  uploadState,
  onSelectTable,
  onBack,
  onFileChange,
  onTableChange,
  onStartWizard,
  setIsNewTable,
  onCloseWizard,
  onNextStep,
  onPrevStep,
  onFinalUpload,
  onRunPipeline,
  isPipelineRunning,
  pipelineFeedback,
  showCuadraturaModal,
  setShowCuadraturaModal
}: Props) => {
  const isLoadingFolders = endpoints?.GetFolders?.loading;
  const { envId } = useParams<{ envId: string }>();

  // Determinamos si mostramos la sección de Pipeline
  const showPipelineSection = envId === "pd";

  // Determinamos el título según el entorno
  const pageTitle = envId === "sap" ? model?.bucketName : model?.productName;

  const formatName = (text: string) => {
  return text.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

  const getBucketCode = (name: string) => name.split('-')[3] || '';

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      
      {/* 1. Sidebar */}
      <ProductSidebar
        productName={pageTitle}
        tables={model?.tables || []}
        loading={isLoadingFolders}
        onSelectTable={onSelectTable}
        onBack={onBack}
      />

      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        
        <FeedbackToast feedback={pipelineFeedback} />

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de {envId === "sap" ? getBucketCode(pageTitle || "").toUpperCase() : formatName(pageTitle || "") || "Producto de Datos"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra la ingesta y visualiza el estado de las tablas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
            <div className={`${showPipelineSection ? "lg:col-span-2" : "lg:col-span-3"} bg-white p-6 rounded-xl shadow-sm border border-gray-200`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
                Nueva Ingesta
              </h2>
              <FileUploadSection
                tables={model?.tables || []}
                uploadState={uploadState}
                onFileChange={onFileChange}
                onTableChange={onTableChange}
                onAction={onStartWizard}
                isNewTable={uploadState.isNewTable}
                setIsNewTable={setIsNewTable}
              />
            </div>

            {/* CAMBIO AQUÍ: Condición para renderizar */}
            {showPipelineSection && (
              <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[250px]">
                <div className="p-3 bg-orange-50 rounded-full">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Reprocesar Producto de Dato</h3>
                  <p className="text-xs text-gray-500 mt-1 px-4">
                    Ejecuta el pipeline completo de Dataform para actualizar las transformaciones.
                  </p>
                </div>
                <div className="w-full flex justify-center px-6">
                  <PipelineButton
                    onRun={onRunPipeline}
                    isLoading={isPipelineRunning}
                    disabled={uploadState.isUploading || uploadState.isWizardOpen}
                  />
                </div>
              </div>
            )}

          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-0">
              {model?.bucketName && (
                <ResumenProducto
                  productName={pageTitle || ""}
                />
              )}
            </div>
          </div>

        </div>
      </main>

      {uploadState.isUploading && showCuadraturaModal && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center animate-fadeIn">

      <div className="mb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Procesando archivo...
      </h2>

      <p className="text-gray-600 text-sm">
        Subiendo archivo y generando tabla en BigQuery
      </p>

      <div className="mt-4 text-sm text-gray-500">
        {uploadState.uploadProgress}% completado
      </div>

    </div>
  </div>
)}

      {/* MODAL WIZARD */}
      <WizardModal
        isOpen={uploadState.isWizardOpen}
        currentStep={uploadState.currentStep}
        stepData={uploadState.stepData}
        isLoading={uploadState.isLoadingAnalysis}
        isUploading={uploadState.isUploading}
        uploadProgress={uploadState.uploadProgress}
        uploadSuccess={uploadState.uploadSuccess}
        uploadMessage={uploadState.uploadMessage}
        uploadError={uploadState.uploadError}
        onClose={onCloseWizard}
        onNext={onNextStep}
        onPrevious={onPrevStep}
        onFinalUpload={onFinalUpload}
        isNewTable={uploadState.isNewTable}
      />

      {showCuadraturaModal && uploadState.uploadSuccess && uploadState.uploadMessage && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center animate-fadeIn">

      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        ¡Ingesta Completada!
      </h2>

      <p className="text-gray-600 mb-6">
        El archivo fue cargado correctamente en BigQuery.
        <br />
        <span className="font-mono bg-green-50 text-green-700 p-1 rounded mt-2 block">
          {uploadState.uploadMessage.b_query}
        </span>
      </p>

      <button
        onClick={() => {
          setShowCuadraturaModal(false);
          window.location.reload();
        }}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full font-bold shadow-md transition-all"
      >
        Cerrar
      </button>

    </div>
  </div>
)}
    </div>
  );
};

export default FolderListScreen;