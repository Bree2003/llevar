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
}: Props) => {
  const isLoadingFolders = endpoints?.GetFolders?.loading;
  const { envId } = useParams<{ envId: string }>();

  return (
    <div className="flex w-full h-full bg-white relative">
      {/* --- TOAST DE FEEDBACK --- */}
      {pipelineFeedback.message && (
        <div
          className={`fixed top-10 right-10 z-[9999] px-6 py-4 rounded-lg shadow-xl border animate-fadeIn flex items-center gap-3 max-w-md bg-white
            ${
              pipelineFeedback.type === "success"
                ? "border-l-4 border-l-green-500"
                : pipelineFeedback.type === "error"
                ? "border-l-4 border-l-red-500"
                : "border-l-4 border-l-blue-500"
            }`}
        >
          {pipelineFeedback.type === "success" && (
            <span className="text-green-500 text-xl">✓</span>
          )}
          {pipelineFeedback.type === "error" && (
            <span className="text-red-500 text-xl">✕</span>
          )}
          {pipelineFeedback.type === "info" && (
            <span className="text-blue-500 text-xl">ℹ</span>
          )}

          <div>
            <p className="font-bold text-gray-800 text-sm">
              {pipelineFeedback.type === "success"
                ? "Éxito"
                : pipelineFeedback.type === "error"
                ? "Error"
                : "Información"}
            </p>
            <p className="text-sm text-gray-600">{pipelineFeedback.message}</p>
          </div>
        </div>
      )}

      <ProductSidebar
        productName={envId === "sap" ? model?.bucketName : model?.productName}
        tables={model?.tables || []}
        loading={isLoadingFolders}
        onSelectTable={onSelectTable}
        onBack={onBack}
      />

      {/* --- LAYOUT PRINCIPAL --- */}
      <main className="flex flex-grow flex-col p-10 w-full h-screen overflow-y-auto">
        {/* Usamos GRID con 2 columnas iguales (mitad y mitad) en pantallas grandes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 w-full">
          {/* --- COLUMNA IZQUIERDA: INGESTA --- */}
          <div className="flex flex-col gap-4">
            {/* Cabecera de la columna izquierda: Botón alineado a la derecha */}
            <div className="flex justify-end mb-[-10px] z-10 relative">
              {/* El mb-[-10px] y z-10 es un truco visual por si el FileUploadSection tiene mucho padding superior, 
                        para que el botón quede alineado con el título "Nueva Ingesta" que trae el componente dentro.
                        Si se ve montado, quita el margin-bottom negativo. */}
              <PipelineButton
                onRun={onRunPipeline}
                isLoading={isPipelineRunning}
                disabled={uploadState.isUploading || uploadState.isWizardOpen}
              />
            </div>

            {/* Sección de Carga */}
            <div className="w-full">
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
          </div>

          {/* --- COLUMNA DERECHA: RESUMEN PRODUCTO --- */}
          <div className="w-full">
            {model?.bucketName && (
              <ResumenProducto
                productName={
                  (envId === "sap" ? model?.bucketName : model?.productName) ||
                  ""
                }
              />
            )}
            {/* Si no hay resumen, podríamos poner un placeholder o dejarlo vacío */}
          </div>
        </div>

        {/* MODAL WIZARD */}
        <WizardModal
          isOpen={uploadState.isWizardOpen}
          currentStep={uploadState.currentStep}
          stepData={uploadState.stepData}
          isLoading={uploadState.isLoadingAnalysis}
          isUploading={uploadState.isUploading}
          uploadProgress={uploadState.uploadProgress}
          uploadSuccess={uploadState.uploadSuccess}
          onClose={onCloseWizard}
          onNext={onNextStep}
          onPrevious={onPrevStep}
          onFinalUpload={onFinalUpload}
          isNewTable={uploadState.isNewTable}
        />
      </main>
    </div>
  );
};

export default FolderListScreen;
