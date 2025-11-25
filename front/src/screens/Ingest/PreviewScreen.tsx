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