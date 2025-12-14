import { useParams } from "react-router-dom"; // 1. Importar el hook
import {
  EndpointName,
  EndpointStatus,
  FolderStateModel,
  UploadState,
} from "controllers/Ingest/FolderListController";
import ResumenProducto from "components/ResumenProducto/ResumenProducto";
import ProductSidebar from "components/DataProduct/ProductSidebar";
import FileUploadSection from "components/DataProduct/FileUploadSection";
import WizardModal from "components/Ingest/Wizard/WizardModal";

interface Props {
  model: Partial<FolderStateModel>;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  uploadState: UploadState;
  onSelectTable: (tableName: string) => void;
  onBack: () => void;

  // Form
  onFileChange: (file: File | null) => void;
  onTableChange: (tableId: string) => void;
  onStartWizard: () => void;

  // Wizard Actions
  onCloseWizard: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFinalUpload: () => void;
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
  onCloseWizard,
  onNextStep,
  onPrevStep,
  onFinalUpload,
}: Props) => {
  
  const isLoadingFolders = endpoints?.GetFolders?.loading;
  // 2. Obtener el parámetro 'envid' de la URL
  const { envId } = useParams<{ envId: string }>(); 
  console.log("env id:", envId)
  console.log("model:", model)

  return (
    <div className="flex w-full h-full bg-white">
      {/* 1. Menú Lateral */}
      <ProductSidebar
        // 3. Usar 'envid' aquí (corregido de envID a envid para coincidir con el param)
        productName={envId === "sap" ? model?.bucketName : model?.productName}
        tables={model?.tables || []}
        loading={isLoadingFolders}
        onSelectTable={onSelectTable}
        onBack={onBack}
      />

      {/* 2. Contenido Principal */}
      <main className="flex flex-grow flex-col p-10 w-full h-screen overflow-y-auto">

        {/* Sección de Selección de Archivo */}
        <FileUploadSection
          tables={model?.tables || []}
          uploadState={uploadState}
          onFileChange={onFileChange}
          onTableChange={onTableChange}
          onAction={onStartWizard}
          />

          {model?.bucketName && (
            <ResumenProducto productName={(envId === "sap" ? model?.bucketName : model?.productName) || ""} />
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
          onClose={onCloseWizard}
          onNext={onNextStep}
          onPrevious={onPrevStep}
          onFinalUpload={onFinalUpload}
        />
      </main>
    </div>
  );
};

export default FolderListScreen;