import {
  Step1Confirmation,
  Step2Structure,
  Step3Validation,
} from "./WizardSteps";

interface WizardModalProps {
  isOpen: boolean;
  currentStep: number;
  stepData: any; // La data específica del paso actual
  isLoading: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinalUpload: () => void;
  isUploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
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
}: WizardModalProps) {
  if (!isOpen) return null;

  // Si la subida terminó exitosamente, mostramos pantalla final
  if (uploadSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
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
            El archivo ha sido procesado y cargado correctamente.
          </p>
          <button
            onClick={onClose}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 w-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const hasBlockingErrors =
    currentStep === 3 && stepData?.bloqueantes?.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[600px] flex flex-col relative">
        {/* Header con Stepper Visual */}
        <div className="p-6 border-b">
          <div className="flex justify-center items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                            ${
                              s === currentStep
                                ? "bg-orange-500 text-white"
                                : s < currentStep
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                >
                  {s < currentStep ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      s < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-center font-bold text-gray-700 mt-4">
            {currentStep === 1 && "Paso 1: Confirmación"}
            {currentStep === 2 && "Paso 2: Análisis de Estructura"}
            {currentStep === 3 && "Paso 3: Validación Final"}
          </h2>
        </div>

        {/* Contenido Principal */}
        <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Analizando archivo...</p>
            </div>
          ) : (
            <>
              {currentStep === 1 && <Step1Confirmation data={stepData} />}
              {currentStep === 2 && <Step2Structure data={stepData} />}
              {currentStep === 3 && <Step3Validation data={stepData} />}
            </>
          )}
        </div>

        {/* Footer con Botones */}
        <div className="p-6 border-t bg-white rounded-b-xl flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-medium"
            disabled={isUploading}
          >
            Cancelar
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={onPrevious}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isUploading || isLoading}
              >
                Anterior
              </button>
            )}

            {currentStep < 3 ? (
              <button
                onClick={onNext}
                className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow disabled:opacity-50"
                disabled={isLoading}
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={onFinalUpload}
                // Deshabilitamos si está subiendo, cargando O si hay errores bloqueantes
                disabled={isUploading || isLoading || hasBlockingErrors}
                className={`px-6 py-2 rounded-lg text-white shadow flex items-center gap-2 transition-colors
        ${
          hasBlockingErrors
            ? "bg-gray-400 cursor-not-allowed" // Estilo gris si hay errores de BQ
            : "bg-green-600 hover:bg-green-700 disabled:opacity-50" // Estilo verde normal
        }
    `}
              >
                {isUploading
                  ? `Subiendo ${uploadProgress}%...`
                  : "Confirmar Ingesta"}
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progreso Global (si está subiendo) */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-100 rounded-b-xl overflow-hidden">
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
