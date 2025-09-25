// src/components/IngestaArchivos/UploadWizardModal.tsx

import { useState, useEffect } from "react";
import Stepper from "./Stepper";
import Step1Confirmation from "./steps/Step1_Confirmation";
import Step2Structure from "./steps/Step2_Structure";
import Step3Validation from "./steps/Step3_Validation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  file: File | null;
}

export default function UploadWizardModal({
  isOpen,
  onClose,
  initialData,
  file,
}: ModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<{ [key: number]: any }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [finalMessage, setFinalMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setStepData({ 1: initialData });
      setCurrentStep(1);
      setFinalMessage(""); // Resetea el mensaje final al abrir
    }
  }, [initialData]);

  const sendLog = async (
    level: "info" | "error" | "warning",
    message: string
  ) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/logs/${level}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          user: "breeale2003@gmail.com", // <-- Usuario real o token auth
          service: "cloud_storage",
          product: "ingesta_archivos",
        }),
      });
    } catch (err) {
      console.error("Error enviando log:", err);
    }
  };

  const fetchStepData = async (step: number) => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("step", String(step));

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/storage/analyze",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStepData((prev) => ({ ...prev, [step]: data }));
      setCurrentStep(step);
    } catch (error: any) {
      alert(`Error al cargar datos del paso ${step}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (stepData[nextStep]) {
      setCurrentStep(nextStep);
    } else {
      fetchStepData(nextStep);
    }
  };

  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  const handleFinalIngest = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("destination", file.name.split(".")[0]);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setFinalMessage(result.message);

      // 👇 Enviar log a backend
      await sendLog("info", `El archivo ${file.name} fue cargado exitosamente`);

      // Opcional: Cerrar automáticamente después de unos segundos
      setTimeout(() => onClose(), 3000);
    } catch (error: any) {
      setFinalMessage(`Error en la ingesta final: ${error.message}`);
      // 👇 Log de error
      await sendLog(
        "error",
        `Error al cargar archivo ${file?.name}: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-3xl">
        <Stepper currentStep={currentStep} />
        <hr className="my-4" />

        <div className="min-h-[250px]">
          {currentStep === 1 && <Step1Confirmation data={stepData[1]} />}
          {currentStep === 2 && <Step2Structure data={stepData[2]} />}
          {currentStep === 3 && <Step3Validation data={stepData[3]} />}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancelar
          </button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                disabled={isLoading}
                className="rounded-md bg-gray-200 py-2 px-6 text-sm font-medium text-gray-800 hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="rounded-md bg-[#F46546] py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400"
              >
                {isLoading ? "Cargando..." : "Siguiente"}
              </button>
            ) : (
              <button
                onClick={handleFinalIngest}
                disabled={isLoading}
                className="rounded-md bg-red-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:bg-gray-400"
              >
                {isLoading ? "Procesando Ingesta..." : "Confirmar Ingesta"}
              </button>
            )}
          </div>
        </div>
        {finalMessage && (
          <div className="mt-4 text-center text-sm p-2 bg-gray-100 rounded">
            {finalMessage}
          </div>
        )}
      </div>
    </div>
  );
}
