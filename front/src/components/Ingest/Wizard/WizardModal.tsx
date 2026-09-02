import { useRef, useState, useEffect } from "react";
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
  isNewTable?: boolean;
  uploadError: string | null;
  uploadMessage: UploadSuccessMessage | null;
}

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
      setMetadata({ tableDescription: "", columnDescriptions: {} });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTableDescChange = (val: string) => {
    setMetadata((prev) => ({ ...prev, tableDescription: val }));
  };

  const handleColumnDescChange = (colName: string, val: string) => {
    setMetadata((prev) => ({
      ...prev,
      columnDescriptions: { ...prev.columnDescriptions, [colName]: val },
    }));
  };

  const handleConfirmIngestion = () => {
    if (isNewTable) {
      onFinalUpload(metadata);
    } else {
      onFinalUpload();
    }
  };

  // 1. Errores bloqueantes técnicos (Tablas existentes)
  const hasTechnicalErrors =
    !isNewTable && currentStep === 3 && stepData?.bloqueantes?.length > 0;

  // 2. Validación de Metadatos Manuales (Nuevas Tablas)
  const validateNewTableMetadata = () => {
    // A. Descripción de tabla obligatoria
    if (!metadata.tableDescription || metadata.tableDescription.trim() === "") {
      return true; // Falta descripción tabla
    }
    // B. Descripción de columnas obligatoria
    if (columnsRef.current && columnsRef.current.length > 0) {
      for (const col of columnsRef.current) {
        const desc = metadata.columnDescriptions[col.nombre];
        if (!desc || desc.trim() === "") {
          return true; // Falta descripción columna
        }
      }
    }
    return false;
  };

  const hasMissingMetadata =
    isNewTable && currentStep === 3 && validateNewTableMetadata();

  // El botón se bloquea si: subiendo, cargando, errores técnicos o faltan metadatos
  const isButtonDisabled =
    isUploading || isLoading || hasTechnicalErrors || hasMissingMetadata;
  console.log(uploadMessage);

  if (uploadSuccess && uploadMessage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Ingesta Completada!
          </h2>
          <p className="text-gray-600 mb-6">
            El archivo ha sido procesado y cargado correctamente en BigQuery.
            Tabla {uploadMessage.b_query}
          </p>

          <button
            onClick={() => {
              onClose();
              window.location.reload();
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full font-bold shadow-md transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (uploadError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center animate-fadeIn">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error en la Ingesta
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Hubo un problema procesando el archivo:
            <br />
            <span className="font-mono bg-red-50 text-red-700 p-1 rounded mt-2 block">
              {uploadError}
            </span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 w-1/3 font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-2/3 font-bold shadow-md transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[720px] flex flex-col relative transition-all">
        <div className="p-6 border-b">
          <div className="flex justify-center items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                  ${s === currentStep ? "bg-orange-500 text-white" : s < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {s < currentStep ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-colors ${s < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-center font-bold text-gray-700 mt-4">
            {currentStep === 1 && "Paso 1: Confirmación de archivo"}
            {currentStep === 2 && "Paso 2: Análisis de estructura"}
            {currentStep === 3 &&
              (isNewTable
                ? "Paso 3: Definición de Metadatos (GCP)"
                : "Paso 3: Validación final")}
          </h2>
        </div>

        <div className="flex-grow p-6 overflow-hidden bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Analizando esquema del archivo...
              </p>
            </div>
          ) : (
            <div className="h-full">
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
        <div className="p-6 border-t bg-white rounded-b-xl flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
            disabled={isUploading}
          >
            Cancelar
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={onPrevious}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={isUploading || isLoading}
              >
                Anterior
              </button>
            )}

            {currentStep < 3 ? (
              <button
                onClick={onNext}
                className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-md disabled:opacity-50 transition-all font-bold"
                disabled={isLoading}
              >
                Siguiente
              </button>
            ) : (
              <div className="flex flex-col items-end">
                <button
                  onClick={handleConfirmIngestion}
                  disabled={isButtonDisabled}
                  className={`px-8 py-2 rounded-lg text-white shadow-lg flex items-center gap-2 transition-all font-bold
                    ${
                      isButtonDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                        : "bg-green-600 hover:bg-green-700 active:scale-95"
                    }`}
                  title={
                    hasMissingMetadata
                      ? "Completa todas las descripciones para continuar"
                      : ""
                  }
                >
                  {isUploading
                    ? `Subiendo ${uploadProgress}%...`
                    : isNewTable
                      ? "Crear Tabla y Cargar"
                      : "Confirmar Ingesta"}
                </button>
              </div>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
