import { useEffect, useRef, useState } from "react";

import {
  Step1Confirmation,
  Step2Structure,
  Step3Validation,
  Step3NewTableDescription,
} from "./WizardSteps";

import { UploadSuccessMessage } from "controllers/Ingest/FolderListController";

interface WizardModalProps {
  isOpen: boolean;
  currentStep: number;
  stepData: any;
  isLoading: boolean;

  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinalUpload: (metadata?: any) => void;

  isUploading: boolean;
  uploadProgress: number;

  uploadSuccess: boolean;
  uploadError: string | null;
  uploadMessage: UploadSuccessMessage | null;

  isNewTable?: boolean;
}

const STEP_LABELS = ["Confirmación", "Estructura", "Validación"];

export default function WizardModal({
  isOpen,
  currentStep,
  stepData,
  isLoading,
  onClose,
  onNext,
  onPrevious,
  onFinalUpload,
  isUploading,
  uploadProgress,
  uploadSuccess,
  uploadMessage,
  isNewTable,
  uploadError,
}: WizardModalProps) {
  const [metadata, setMetadata] = useState({
    tableDescription: "",
    columnDescriptions: {} as Record<string, string>,
  });

  const columnsRef = useRef<any[]>([]);

  if (currentStep === 2 && stepData?.columnas_encontradas) {
    columnsRef.current = stepData.columnas_encontradas;
  }

  useEffect(() => {
    if (!isOpen) {
      setMetadata({
        tableDescription: "",
        columnDescriptions: {},
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTableDescChange = (value: string) => {
    setMetadata((prev) => ({
      ...prev,
      tableDescription: value,
    }));
  };

  const handleColumnDescChange = (columnName: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      columnDescriptions: {
        ...prev.columnDescriptions,
        [columnName]: value,
      },
    }));
  };

  const handleConfirmIngestion = () => {
    if (isNewTable) {
      onFinalUpload(metadata);
    } else {
      onFinalUpload();
    }
  };

  const hasTechnicalErrors =
    !isNewTable && currentStep === 3 && stepData?.bloqueantes?.length > 0;

  const validateNewTableMetadata = () => {
    if (!metadata.tableDescription || metadata.tableDescription.trim() === "") {
      return true;
    }

    if (columnsRef.current && columnsRef.current.length > 0) {
      for (const column of columnsRef.current) {
        const description = metadata.columnDescriptions[column.nombre];

        if (!description || description.trim() === "") {
          return true;
        }
      }
    }

    return false;
  };

  const hasMissingMetadata =
    isNewTable && currentStep === 3 && validateNewTableMetadata();

  const isButtonDisabled =
    isUploading || isLoading || hasTechnicalErrors || hasMissingMetadata;

  const stepTitle =
    currentStep === 1
      ? "Confirmación de archivo"
      : currentStep === 2
        ? "Análisis de estructura"
        : isNewTable
          ? "Definición de metadatos"
          : "Validación final";

  /* SUCCESS */
  if (uploadSuccess && uploadMessage) {
    return (
      <div
        className="
          fixed
          inset-0
          z-[9999]
          bg-black/60
          backdrop-blur-[2px]

          flex
          items-center
          justify-center

          p-4
          md:p-6
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
              leading-relaxed
            "
          >
            El archivo fue procesado y cargado correctamente en BigQuery.
          </p>

          <div
            className="
              mt-5
              p-3

              rounded-xl

              bg-[--color-background]

              border
              border-[--color-border]

              font-mono
              text-sm
              text-[--color-text-primary]

              break-all
            "
          >
            {uploadMessage.b_query}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
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
              text-sm
              font-semibold

              hover:opacity-90

              transition-opacity
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  /* ERROR */
  if (uploadError) {
    return (
      <div
        className="
          fixed
          inset-0
          z-[9999]

          bg-black/60
          backdrop-blur-[2px]

          flex
          items-center
          justify-center

          p-4
          md:p-6
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

              bg-red-100
              text-red-600
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
                d="M6 18L18 6M6 6l12 12"
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
            Error en la ingesta
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-[--color-text-secondary]
            "
          >
            Hubo un problema al procesar el archivo.
          </p>

          <div
            className="
              mt-5

              p-3

              max-h-[180px]
              overflow-y-auto

              rounded-xl

              bg-red-50

              border
              border-red-100

              font-mono
              text-xs
              sm:text-sm

              text-red-700

              break-words
              text-left
            "
          >
            {uploadError}
          </div>

          <div
            className="
              mt-6

              flex
              flex-col-reverse
              sm:flex-row

              gap-3
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                w-full

                px-4
                py-2.5

                rounded-[10px]

                border
                border-[--color-border]

                bg-white

                text-sm
                font-semibold
                text-[--color-text-secondary]

                hover:bg-[--color-background]

                transition-colors
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                w-full

                px-4
                py-2.5

                rounded-[10px]

                bg-red-600

                text-white
                text-sm
                font-semibold

                hover:bg-red-700

                transition-colors
              "
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* WIZARD */
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]

        bg-black/60
        backdrop-blur-[2px]

        flex
        items-center
        justify-center

        p-3
        sm:p-4
        md:p-6
      "
    >
      <div
        className="
          w-full

          max-w-5xl

          h-[calc(100dvh-24px)]
          sm:h-[calc(100dvh-32px)]
          md:h-auto

          md:max-h-[calc(100dvh-48px)]
          lg:max-h-[850px]

          bg-white

          rounded-2xl

          border
          border-[--color-border]

          shadow-2xl

          flex
          flex-col

          overflow-hidden
        "
      >
        {/* HEADER */}
        <header
          className="
            flex-shrink-0

            px-4
            py-5

            sm:px-6
            md:px-8
            md:py-6

            border-b
            border-[--color-border]

            bg-white
          "
        >
          {/* STEPPER */}
          <div
            className="
              w-full
              max-w-2xl
              mx-auto

              flex
              items-start
              justify-center
            "
          >
            {[1, 2, 3].map((step, index) => {
              const isActive = step === currentStep;

              const isCompleted = step < currentStep;

              return (
                <div
                  key={step}
                  className={`
                      flex
                      items-start

                      ${step < 3 ? "flex-1" : ""}
                    `}
                >
                  <div
                    className="
                        flex
                        flex-col
                        items-center
                        min-w-0
                      "
                  >
                    <div
                      className={`
                          w-8
                          h-8
                          md:w-9
                          md:h-9

                          flex
                          items-center
                          justify-center

                          rounded-full

                          text-xs
                          md:text-sm

                          font-bold

                          border-2

                          transition-colors

                          ${
                            isCompleted
                              ? "bg-[--color-accent] border-[--color-accent] text-white"
                              : isActive
                                ? "bg-[--color-accent] border-[--color-accent] text-white"
                                : "bg-white border-[--color-border] text-[--color-text-muted]"
                          }
                        `}
                    >
                      {isCompleted ? "✓" : step}
                    </div>

                    <span
                      className={`
                          hidden
                          sm:block

                          mt-2

                          text-xs
                          font-medium
                          text-center

                          ${
                            isActive || isCompleted
                              ? "text-[--color-text-primary]"
                              : "text-[--color-text-muted]"
                          }
                        `}
                    >
                      {STEP_LABELS[index]}
                    </span>
                  </div>

                  {step < 3 && (
                    <div
                      className="
                          flex-1

                          h-[2px]

                          mt-4
                          md:mt-[17px]

                          mx-2
                          sm:mx-4

                          bg-[--color-border]

                          overflow-hidden
                        "
                    >
                      <div
                        className={`
                            h-full
                            bg-[--color-accent]

                            transition-all
                            duration-300

                            ${isCompleted ? "w-full" : "w-0"}
                          `}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* STEP TITLE */}
          <div className="mt-5 text-center">
            <p
              className="
                text-xs
                md:text-sm

                font-semibold
                uppercase
                tracking-wide

                text-[--color-accent]
              "
            >
              Paso {currentStep} de 3
            </p>

            <h2
              className="
                mt-1

                text-lg
                md:text-xl
                lg:text-2xl

                font-bold

                text-[--color-text-primary]
              "
            >
              {stepTitle}
            </h2>
          </div>
        </header>

        {/* CONTENT */}
        <div
          className="
            flex-1
            min-h-0

            overflow-y-auto

            bg-gray-50

            p-4
            sm:p-5
            md:p-6
            lg:p-8
          "
        >
          {isLoading ? (
            <div
              className="
                h-full
                min-h-[300px]

                flex
                flex-col
                items-center
                justify-center

                text-center
              "
            >
              <div
                className="
                  w-12
                  h-12

                  rounded-full

                  border-4
                  border-[--color-accent-light]
                  border-t-[--color-accent]

                  animate-spin
                "
              />

              <h3
                className="
                  mt-5

                  text-base
                  md:text-lg

                  font-semibold

                  text-[--color-text-primary]
                "
              >
                Analizando archivo
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-[--color-text-secondary]
                "
              >
                Estamos revisando la estructura y el esquema de los datos.
              </p>
            </div>
          ) : (
            <div
              className="
                w-full
                max-w-4xl
                mx-auto
              "
            >
              {currentStep === 1 && <Step1Confirmation data={stepData} />}

              {currentStep === 2 && <Step2Structure data={stepData} />}

              {currentStep === 3 &&
                (isNewTable ? (
                  <Step3NewTableDescription
                    columns={columnsRef.current || []}
                    metadata={metadata}
                    onTableDescChange={handleTableDescChange}
                    onColumnDescChange={handleColumnDescChange}
                  />
                ) : (
                  <Step3Validation data={stepData} />
                ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer
          className="
            flex-shrink-0

            px-4
            py-4

            sm:px-6
            md:px-8

            bg-white

            border-t
            border-[--color-border]

            flex
            flex-col-reverse
            sm:flex-row

            sm:items-center
            sm:justify-between

            gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="
              w-full
              sm:w-auto

              px-4
              py-2.5

              rounded-[10px]

              text-sm
              font-semibold

              text-[--color-text-secondary]

              hover:bg-[--color-background]

              transition-colors

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Cancelar
          </button>

          <div
            className="
              w-full
              sm:w-auto

              flex
              flex-col-reverse
              sm:flex-row

              gap-3
            "
          >
            {currentStep > 1 && (
              <button
                type="button"
                onClick={onPrevious}
                disabled={isUploading || isLoading}
                className="
                  w-full
                  sm:w-auto

                  min-w-[110px]

                  px-5
                  py-2.5

                  rounded-[10px]

                  border
                  border-[--color-border]

                  bg-white

                  text-sm
                  font-semibold

                  text-[--color-text-secondary]

                  hover:bg-[--color-background]

                  transition-colors

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Anterior
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={onNext}
                disabled={isLoading}
                className="
                  w-full
                  sm:w-auto

                  min-w-[120px]

                  px-5
                  py-2.5

                  rounded-[10px]

                  bg-[--color-accent]

                  text-white
                  text-sm
                  font-semibold

                  hover:opacity-90

                  transition-opacity

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmIngestion}
                disabled={isButtonDisabled}
                title={
                  hasMissingMetadata
                    ? "Completa todas las descripciones para continuar"
                    : ""
                }
                className={`
                  w-full
                  sm:w-auto

                  min-w-[170px]

                  px-5
                  py-2.5

                  rounded-[10px]

                  text-sm
                  font-semibold

                  transition-all

                  ${
                    isButtonDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[--color-accent] text-white hover:opacity-90"
                  }
                `}
              >
                {isUploading
                  ? `Subiendo ${uploadProgress}%...`
                  : isNewTable
                    ? "Crear tabla y cargar"
                    : "Confirmar ingesta"}
              </button>
            )}
          </div>
        </footer>

        {/* PROGRESS */}
        {isUploading && (
          <div
            className="
              flex-shrink-0

              w-full
              h-1.5

              bg-[--color-background]
            "
          >
            <div
              className="
                h-full

                bg-[--color-accent]

                transition-all
                duration-300
              "
              style={{
                width: `${uploadProgress}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
