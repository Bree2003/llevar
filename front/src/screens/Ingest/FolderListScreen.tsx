import {
  EndpointName,
  EndpointStatus,
  FolderStateModel,
  UploadState,
} from "controllers/Ingest/FolderListController";
import ResumenProducto from "components/ResumenProducto/ResumenProducto"; // Asegúrate que la ruta sea correcta
import ProductSidebar from "components/DataProduct/ProductSidebar";
import FileUploadSection from "components/DataProduct/FileUploadSection";

interface Props {
  model: Partial<FolderStateModel> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  uploadState: UploadState;
  onSelectTable: (tableName: string) => void;
  onBack: () => void;
  onFileChange: (file: File | null) => void;
  onTableChange: (tableId: string) => void;
  onUpload: () => void;
  onResetUpload: () => void; // La función para resetear el form de carga
}

const FolderListScreen = ({
  model,
  endpoints,
  uploadState,
  onSelectTable,
  onBack,
  onFileChange,
  onTableChange,
  onUpload,
  onResetUpload, // Recibimos la nueva función
}: Props) => {
  const isLoadingFolders = endpoints?.GetFolders?.loading;
  
  // onToggleModal ya no es necesario aquí porque no hay modal.
  console.log("Model", model)

  return (
    <div className="flex w-full h-full bg-white">
      {/* 1. Menú Lateral con la lista de tablas */}
      <ProductSidebar
        productName={model?.productName}
        tables={model?.tables || []}
        loading={isLoadingFolders}
        onSelectTable={onSelectTable}
      />

      {/* 2. Contenido Principal */}
      <main className="flex flex-grow flex-col p-10 w-full h-screen overflow-y-auto">


        {/* 2a. Resumen del Producto (usa su propia lógica de carga) */}
        {model?.productName && <ResumenProducto productName={model.productName} />}
        
        {/* 2b. Sección de Ingesta de Archivos */}
        <FileUploadSection
            tables={model?.tables || []}
            uploadState={uploadState}
            onFileChange={onFileChange}
            onTableChange={onTableChange}
            onUpload={onUpload}
            onReset={onResetUpload} // Pasamos la función de reseteo
        />
      </main>
    </div>
  );
};

export default FolderListScreen;