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

  const isBusy = isSaving || isLoading || isDownloading;

  return (
    <main
      className="
        w-full
        min-h-full
        bg-gray-50
        text-left
        py-6
        md:py-8
      "
    >
      <div
        className="
          w-full
          max-w-[1600px]
          mx-auto
          px-4
          md:px-6
          lg:px-8
        "
      >
        {/* Navegación / acciones */}
        <div
          className="
            w-full
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          "
        >
          {/* Volver */}
          <button
            type="button"
            onClick={onBack}
            disabled={isSaving || isDownloading}
            className="
              w-fit

              flex
              items-center
              gap-2

              text-sm
              md:text-base
              font-semibold

              text-[--color-text-secondary]

              hover:text-[--color-accent]

              transition-colors

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <span className="text-lg">←</span>
            Volver a tablas
          </button>

          {/* Descargar */}
          <button
            type="button"
            onClick={onDownloadExcel}
            disabled={isBusy}
            className="
              w-full
              sm:w-auto

              flex
              items-center
              justify-center
              gap-2

              px-4
              py-2.5

              rounded-[10px]

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold

              hover:opacity-90

              transition-opacity

              disabled:bg-gray-200
              disabled:text-gray-400
              disabled:cursor-not-allowed
            "
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                  />
                </svg>
                Descargando...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
                  />
                </svg>
                Descargar Excel
              </>
            )}
          </button>
        </div>

        {/* Editor */}
        <section className="w-full mt-6 md:mt-8">
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
        </section>
      </div>
    </main>
  );
};

export default PreviewScreen;
