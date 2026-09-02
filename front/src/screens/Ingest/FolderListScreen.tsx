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
    info: "border-l-[--color-accent] text-[--color-accent]",
  };

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      className={`
        fixed
        top-5
        right-5
        z-[9999]

        w-[calc(100%-2rem)]
        sm:w-auto
        sm:min-w-[360px]
        max-w-sm

        px-4
        py-3

        bg-white

        rounded-lg
        shadow-lg

        border
        border-[--color-border]
        border-l-4

        animate-fade-in-down

        flex
        items-start
        gap-3

        ${styles[type]}
      `}
    >
      <span className="text-xl font-bold leading-none mt-0.5">
        {icon[type]}
      </span>

      <div>
        <p className="font-bold text-[--color-text-primary] text-sm capitalize">
          {type === "success"
            ? "Iniciado"
            : type === "error"
              ? "Error"
              : "Información"}
        </p>

        <p className="text-sm text-[--color-text-secondary] mt-1">
          {feedback.message}
        </p>
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
  setShowCuadraturaModal,
}: Props) => {
  const isLoadingFolders = endpoints?.GetFolders?.loading;

  const { envId } = useParams<{
    envId: string;
  }>();

  const showPipelineSection = envId === "pd";

  const pageTitle = envId === "sap" ? model?.bucketName : model?.productName;

  const formatName = (text: string) => {
    return text
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getBucketCode = (name: string) => name.split("-")[3] || "";

  return (
    <div
      className="
        flex
        items-start

        w-full
        min-h-full

        bg-[--color-background]
      "
    >
      {/* SIDEBAR DE PRODUCTO / TABLAS */}
      <ProductSidebar
        productName={pageTitle}
        tables={model?.tables || []}
        loading={isLoadingFolders}
        onSelectTable={onSelectTable}
        onBack={onBack}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main
        className="
          flex-1
          min-w-0

          relative
        "
      >
        <FeedbackToast feedback={pipelineFeedback} />

        <div
          className="
            p-4
            md:p-6
            lg:p-8

            max-w-7xl
            mx-auto

            w-full

            space-y-8
          "
        >
          {/* HEADER */}
          <div>
            <h1
              className="
                text-2xl
                md:text-3xl

                font-bold

                text-[--color-accent]
              "
            >
              Gestión de{" "}
              {envId === "sap"
                ? getBucketCode(pageTitle || "").toUpperCase()
                : formatName(pageTitle || "") || "Producto de Datos"}
            </h1>

            <p
              className="
                text-sm

                text-[--color-text-secondary]

                mt-1
              "
            >
              Administra la ingesta y visualiza el estado de las tablas.
            </p>
          </div>

          {/* INGESTA + PIPELINE */}
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3

              gap-6
            "
          >
            {/* NUEVA INGESTA */}
            <div
              className={`
                ${showPipelineSection ? "lg:col-span-2" : "lg:col-span-3"}

                bg-white

                p-5
                md:p-6

                rounded-xl

                shadow-sm

                border
                border-[--color-border]
              `}
            >
              <h2
                className="
                  text-lg
                  font-semibold

                  text-[--color-text-primary]

                  mb-6
                  pb-2

                  border-b
                  border-[--color-border]
                "
              >
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

            {/* PIPELINE */}
            {showPipelineSection && (
              <div
                className="
                  lg:col-span-1

                  bg-white

                  p-5
                  md:p-6

                  rounded-xl

                  shadow-sm

                  border
                  border-[--color-border]

                  flex
                  flex-col
                  items-center
                  justify-center

                  text-center

                  space-y-4

                  h-full
                  min-h-[250px]
                "
              >
                <div
                  className="
                    p-3

                    bg-[--color-accent-light]

                    rounded-full
                  "
                >
                  <svg
                    className="
                      w-8
                      h-8

                      text-[--color-accent]
                    "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>

                <div>
                  <h3
                    className="
                      text-md
                      font-semibold

                      text-[--color-text-primary]
                    "
                  >
                    Reprocesar Producto de Dato
                  </h3>

                  <p
                    className="
                      text-xs

                      text-[--color-text-secondary]

                      mt-1
                      px-4
                    "
                  >
                    Ejecuta el pipeline completo de Dataform para actualizar las
                    transformaciones.
                  </p>
                </div>

                <div className="w-full flex justify-center px-3 md:px-6">
                  <PipelineButton
                    onRun={onRunPipeline}
                    isLoading={isPipelineRunning}
                    disabled={
                      uploadState.isUploading || uploadState.isWizardOpen
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* RESUMEN */}
          <div
            className="
              bg-white

              rounded-xl

              shadow-sm

              border
              border-[--color-border]

              overflow-hidden
            "
          >
            {model?.bucketName && (
              <ResumenProducto productName={pageTitle || ""} />
            )}
          </div>
        </div>
      </main>

      {/* MODAL PROCESANDO */}
      {uploadState.isUploading && showCuadraturaModal && (
        <div
          className="
              fixed
              inset-0

              bg-black/70

              flex
              justify-center
              items-center

              z-50

              p-4
            "
        >
          <div
            className="
                bg-white

                rounded-xl

                shadow-2xl

                p-6
                md:p-8

                w-full
                max-w-md

                text-center

                animate-fadeIn
              "
          >
            <div className="mb-6">
              <div
                className="
                    animate-spin

                    rounded-full

                    h-12
                    w-12

                    border-4
                    border-[--color-accent-light]
                    border-t-[--color-accent]

                    mx-auto
                  "
              />
            </div>

            <h2
              className="
                  text-xl
                  font-bold

                  text-[--color-text-primary]

                  mb-2
                "
            >
              Procesando archivo...
            </h2>

            <p
              className="
                  text-[--color-text-secondary]

                  text-sm
                "
            >
              Subiendo archivo y generando tabla en BigQuery
            </p>

            <div
              className="
                  mt-4

                  text-sm

                  text-[--color-text-muted]
                "
            >
              {uploadState.uploadProgress}% completado
            </div>
          </div>
        </div>
      )}

      {/* WIZARD */}
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

      {/* SUCCESS */}
      {showCuadraturaModal &&
        uploadState.uploadSuccess &&
        uploadState.uploadMessage && (
          <div
            className="
              fixed
              inset-0

              bg-black/70

              flex
              justify-center
              items-center

              z-50

              p-4
            "
          >
            <div
              className="
                bg-white

                rounded-xl

                border
                border-[--color-border]

                shadow-2xl

                p-6
                md:p-8

                w-full
                max-w-md

                text-center

                animate-fadeIn
              "
            >
              <div
                className="
                  w-20
                  h-20

                  bg-green-100
                  text-green-600

                  rounded-full

                  flex
                  items-center
                  justify-center

                  mx-auto
                  mb-6
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2
                className="
                  text-2xl
                  font-bold

                  text-[--color-text-primary]

                  mb-2
                "
              >
                ¡Ingesta Completada!
              </h2>

              <p
                className="
                  text-[--color-text-secondary]

                  mb-6
                "
              >
                El archivo fue cargado correctamente en BigQuery.
                <br />
                <span
                  className="
                    font-mono

                    bg-[--color-background]

                    text-[--color-text-primary]

                    border
                    border-[--color-border]

                    p-2

                    rounded-lg

                    mt-3

                    block

                    break-all
                  "
                >
                  {uploadState.uploadMessage.b_query}
                </span>
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowCuadraturaModal(false);
                  window.location.reload();
                }}
                className="
                  bg-[--color-accent]

                  text-white

                  px-6
                  py-2.5

                  rounded-[10px]

                  hover:opacity-90

                  w-full

                  font-semibold

                  transition-opacity
                "
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
