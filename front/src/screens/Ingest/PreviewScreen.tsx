import DataGridEditor from "components/DataProduct/DataGridPreview"; // Asegúrate que el import apunte a tu archivo editado
import {
  EndpointName,
  EndpointStatus,
  UploadStateModel,
} from "controllers/Ingest/PreviewController";

interface Props {
  model: Partial<UploadStateModel> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  onBack: () => void;
  onSave: (rows: any[]) => void; // Recibimos la función del controller
}

const PreviewScreen = ({ model, endpoints, onBack, onSave }: Props) => {
  const isLoading = endpoints?.GetLatestDataset?.loading;

  // También podríamos bloquear la UI si se está guardando
  const isSaving = endpoints?.SaveDataset?.loading;

  return (
    <div className="w-full">
      <div className="pt-5 pl-10">
        <button
          onClick={onBack}
          // Deshabilitamos volver si estamos guardando para evitar inconsistencias
          disabled={isSaving}
          className={`flex items-center px-4 py-3 bg-white rounded-lg shadow-sm
                        text-orange-600 border border-orange-300
                        hover:bg-orange-50 hover:border-orange-400 hover:shadow-md
                        text-sm font-semibold transition-all duration-200 justify-start
                        ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="mr-2 text-lg">←</span>
          Volver a tablas
        </button>
      </div>

      <DataGridEditor
        loading={isLoading || isSaving} // Mostramos skeleton si carga O si guarda
        file={model?.currentFile}
        breadcrumbs={{
          envId: model?.envId,
          bucketName: model?.bucketName,
          productName: model?.productName,
          tableName: model?.tableName,
        }}
        onSave={onSave} // Conectamos el botón Guardar del Grid con el Controller
      />
    </div>
  );
};

export default PreviewScreen;
