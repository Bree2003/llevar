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
    success: "border-green-200 bg-green-50 text-green-700",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
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
        z-[9999]

        top-4
        left-4
        right-4

        sm:left-auto
        sm:right-5
        sm:w-[360px]

        lg:top-5

        p-4

        rounded-xl
        border
        shadow-lg

        flex
        items-start
        gap-3

        animate-fade-in-down

        ${styles[type]}
      `}
    >
      <div
        className="
          w-8
          h-8
          flex
          items-center
          justify-center
          rounded-full
          bg-white
          flex-shrink-0
          font-bold
        "
      >
        {icon[type]}
      </div>

      <div className="min-w-0">
        <p className="font-bold text-sm text-[--color-text-primary]">
          {type === "success"
            ? "Iniciado"
            : type === "error"
              ? "Error"
              : "Información"}
        </p>

        <p className="text-sm mt-1 break-words">{feedback.message}</p>
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

  const displayTitle =
    envId === "sap"
      ? getBucketCode(pageTitle || "").toUpperCase()
      : formatName(pageTitle || "") || "Producto de Datos";

  return (
    <div
      className="
        w-full
        min-h-full

        flex
        flex-col
        lg:flex-row
      "
    >
      {/* SIDEBAR SECUNDARIO */}
      <ProductSidebar
        productName={pageTitle}
        tables={model?.tables || []}
        loading={isLoadingFolders}
        onSelectTable={onSelectTable}
        onBack={onBack}
      />

      {/* CONTENIDO */}
      <main
        className="
          flex-1
          min-w-0
          min-h-full
          text-left

          py-6
          md:py-8
        "
      >
        <FeedbackToast feedback={pipelineFeedback} />

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
          {/* HEADER */}
          <section className="w-full">
            <h1
              className="
                text-3xl
                md:text-4xl
                xl:text-5xl
                font-bold
                text-[--color-accent]
              "
            >
              Gestión de {displayTitle}
            </h1>

            <p
              className="
                mt-4
                md:mt-6

                text-base
                md:text-lg

                font-medium
                leading-relaxed

                max-w-4xl

                text-[--color-text-secondary]
              "
            >
              Administra la ingesta de información y visualiza el estado de las
              tablas asociadas.
            </p>
          </section>

          {/* INGESTA + PIPELINE */}
          <section
            className={`
              w-full

              mt-8
              md:mt-10

              grid
              grid-cols-1

              ${
                showPipelineSection
                  ? "xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]"
                  : ""
              }

              gap-6
              md:gap-8

              items-stretch
            `}
          >
            {/* NUEVA INGESTA */}
            <div
              className="
                w-full
                min-w-0

                bg-white

                border
                border-[--color-border]

                rounded-2xl

                p-5
                md:p-6
                lg:p-8
              "
            >
              <div>
                <h2
                  className="
                    text-xl
                    md:text-2xl
                    font-bold
                    text-[--color-text-primary]
                  "
                >
                  Nueva ingesta
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    md:text-base
                    text-[--color-text-secondary]
                  "
                >
                  Selecciona el destino y carga el archivo que deseas procesar.
                </p>
              </div>

              <div className="w-full border-t border-[--color-border] my-6" />

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
              <aside
                className="
                  w-full

                  bg-white

                  border
                  border-[--color-border]

                  rounded-2xl

                  p-5
                  md:p-6

                  flex
                  flex-col
                  justify-between

                  h-full
                "
              >
                <div>
                  <div
                    className="
                      w-12
                      h-12

                      flex
                      items-center
                      justify-center

                      rounded-xl

                      bg-[--color-accent-light]
                      text-[--color-accent]
                    "
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg
                      md:text-xl
                      font-bold
                      text-[--color-text-primary]
                    "
                  >
                    Reprocesar Producto de Datos
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-relaxed
                      text-[--color-text-secondary]
                    "
                  >
                    Ejecuta el pipeline completo de Dataform para actualizar las
                    transformaciones asociadas a este producto de datos.
                  </p>
                </div>

                <div className="mt-6">
                  <PipelineButton
                    onRun={onRunPipeline}
                    isLoading={isPipelineRunning}
                    disabled={
                      uploadState.isUploading || uploadState.isWizardOpen
                    }
                  />
                </div>
              </aside>
            )}
          </section>

          {/* RESUMEN */}
          {model?.bucketName && (
            <section className="w-full mt-6 md:mt-8">
              <ResumenProducto productName={pageTitle || ""} />
            </section>
          )}
        </div>
      </main>

      {/* MODAL PROCESANDO */}
      {uploadState.isUploading && showCuadraturaModal && (
        <div
          className="
              fixed
              inset-0
              z-50

              bg-black/60

              flex
              items-center
              justify-center

              p-4
            "
        >
          <div
            className="
                w-full
                max-w-md

                bg-white

                rounded-2xl

                border
                border-[--color-border]

                shadow-2xl

                p-6
                md:p-8

                text-center
              "
          >
            <div
              className="
                  w-14
                  h-14

                  mx-auto

                  rounded-full

                  border-4
                  border-[--color-accent-light]
                  border-t-[--color-accent]

                  animate-spin
                "
            />

            <h2
              className="
                  mt-6

                  text-xl
                  md:text-2xl

                  font-bold

                  text-[--color-text-primary]
                "
            >
              Procesando archivo...
            </h2>

            <p
              className="
                  mt-2
                  text-sm
                  md:text-base
                  text-[--color-text-secondary]
                "
            >
              Subiendo archivo y generando la tabla en BigQuery.
            </p>

            <div className="mt-6">
              <div
                className="
                    w-full
                    h-2

                    overflow-hidden

                    rounded-full

                    bg-[--color-background]
                  "
              >
                <div
                  className="
                      h-full
                      rounded-full
                      bg-[--color-accent]
                      transition-all
                      duration-300
                    "
                  style={{
                    width: `${uploadState.uploadProgress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm text-[--color-text-secondary]">
                {uploadState.uploadProgress}% completado
              </p>
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

      {/* ÉXITO */}
      {showCuadraturaModal &&
        uploadState.uploadSuccess &&
        uploadState.uploadMessage && (
          <div
            className="
              fixed
              inset-0
              z-50

              bg-black/60

              flex
              items-center
              justify-center

              p-4
            "
          >
            <div
              className="
                w-full
                max-w-md

                bg-white

                rounded-2xl

                border
                border-[--color-border]

                shadow-2xl

                p-6
                md:p-8

                text-center
              "
            >
              <div
                className="
                  w-16
                  h-16

                  mx-auto

                  flex
                  items-center
                  justify-center

                  rounded-full

                  bg-green-100
                  text-green-600
                "
              >
                <svg
                  className="w-8 h-8"
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
                  mt-5

                  text-xl
                  md:text-2xl

                  font-bold

                  text-[--color-text-primary]
                "
              >
                ¡Ingesta completada!
              </h2>

              <p
                className="
                  mt-2

                  text-sm
                  md:text-base

                  text-[--color-text-secondary]
                "
              >
                El archivo fue cargado correctamente en BigQuery.
              </p>

              <div
                className="
                  mt-5

                  p-3

                  rounded-xl

                  bg-[--color-background]

                  text-sm
                  font-mono
                  text-[--color-text-primary]

                  break-all
                "
              >
                {uploadState.uploadMessage.b_query}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCuadraturaModal(false);
                  window.location.reload();
                }}
                className="
                  w-full

                  mt-6

                  px-5
                  py-2.5

                  rounded-[10px]

                  bg-[--color-accent]
                  text-white

                  font-semibold

                  hover:opacity-90

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
