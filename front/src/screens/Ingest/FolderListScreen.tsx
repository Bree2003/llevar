import { useParams } from "react-router-dom";
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
  
  setIsNewTable: (isNew: boolean) => void; 

  // Wizard Actions
  onCloseWizard: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFinalUpload: (metadata?: any) => void; 
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
}: Props) => {
  
  const isLoadingFolders = endpoints?.GetFolders?.loading;  
  const { envId } = useParams<{ envId: string }>();   
  return (
    <div className="flex w-full h-full bg-white">
      <ProductSidebar
        productName={envId === "sap" ? model?.bucketName : model?.productName}
        tables={model?.tables || []}
        loading={isLoadingFolders}
        onSelectTable={onSelectTable}
        onBack={onBack}
      />

      <main className="flex flex-grow flex-col p-10 w-full h-screen overflow-y-auto">

        {/* Sección de Selección de Archivo */}
        <FileUploadSection
          tables={model?.tables || []}
          uploadState={uploadState}
          onFileChange={onFileChange}
          onTableChange={onTableChange}
          onAction={onStartWizard}
          isNewTable={uploadState.isNewTable} 
          setIsNewTable={setIsNewTable}
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
          isNewTable={uploadState.isNewTable}
        />
      </main>
    </div>
  );
};

export default FolderListScreen;