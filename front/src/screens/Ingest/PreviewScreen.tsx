import DataGridEditor from "components/DataProduct/DataGridEditor";
import {
  EndpointName,
  EndpointStatus,
  UploadStateModel,
} from "controllers/Ingest/PreviewController";

interface Props {
  model: Partial<UploadStateModel> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  onBack: () => void;
  onSave: (rows: any[]) => void;
  onDownloadExcel: () => void;
}

const PreviewScreen = ({
  model,
  endpoints,
  onBack,
  onSave,
  onDownloadExcel,
}: Props) => {
  const isLoading = endpoints?.GetLatestDataset?.loading;
  const isSaving = endpoints?.SaveDataset?.loading;
  const isDownloading = endpoints?.DownloadExcel?.loading;

  return (
    <div className="w-full">
      <div className="pt-5 px-10 flex justify-between">
        {/* BACK */}
        <button
          onClick={onBack}
          disabled={isSaving || isDownloading}
          className={`flex items-center px-4 py-3 bg-white rounded-lg shadow-sm
            text-orange-600 border border-orange-300
            hover:bg-orange-50 hover:border-orange-400 hover:shadow-md
            text-sm font-semibold transition-all duration-200
            ${isSaving || isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="mr-2 text-lg">←</span>
          Volver a tablas
        </button>

        <button
          onClick={onDownloadExcel}
          disabled={isSaving || isLoading || isDownloading}
          className={`flex items-center px-4 py-3 rounded-lg shadow-sm
            bg-orange-600 text-white
            hover:bg-orange-700
            text-sm font-semibold transition-all duration-200
            ${isSaving || isLoading || isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isDownloading ? (
            <>
              {/* Spinner */}
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                />
              </svg>
              Descargando...
            </>
          ) : (
            <>Descargar Excel</>
          )}
        </button>
      </div>

      <DataGridEditor
        loading={isLoading || isSaving}
        file={model?.currentFile}
        breadcrumbs={{
          envId: model?.envId,
          bucketName: model?.bucketName,
          productName: model?.productName,
          tableName: model?.tableName,
        }}
        onSave={onSave}
      />
    </div>
  );
};

export default PreviewScreen;
