import DataGridPreview from "components/DataProduct/DataGridPreview";
import {
  EndpointName,
  EndpointStatus,
  UploadStateModel,
} from "controllers/Ingest/PreviewController";
// --- NUEVO: Importamos el componente de presentación ---

interface Props {
  model: Partial<UploadStateModel> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  onBack: () => void;
}

const PreviewScreen = ({ model, endpoints, onBack }: Props) => {
  const isLoading = endpoints?.GetLatestDataset?.loading;

  return (
    <div className="w-full">
      {/* El botón de 'Volver' es parte de la navegación de la página, por lo que se queda aquí */}
<div className="pt-5 pl-10"> {/* Contenedor y separador */}
        <button
            onClick={onBack}
            className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm
                       text-orange-600 border border-orange-300
                       hover:bg-orange-50 hover:border-orange-400 hover:shadow-md
                       text-sm font-semibold transition-all duration-200 justify-start"
        >
            <span className="mr-2 text-lg">←</span> {/* Flecha un poco más grande */}
            Volver a tablas
        </button>
    </div>
      {/* --- CAMBIO CLAVE: Renderizamos el componente de grilla, pasándole todos los datos --- */}
      <DataGridPreview
        loading={isLoading}
        file={model?.currentFile}
        breadcrumbs={{
          envId: model?.envId,
          bucketName: model?.bucketName,
          productName: model?.productName,
          tableName: model?.tableName,
        }}
      />
    </div>
  );
};

export default PreviewScreen;