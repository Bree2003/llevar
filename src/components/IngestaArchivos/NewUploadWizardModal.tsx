import { useEffect, useState } from "react";
import Stepper from "./Stepper";
import Step1Confirmation from "./steps/Step1_Confirmation";
import Step2Structure from "./steps/Step2_Structure";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
    file: File | null;
    productName: string;
    datasetName: string;
    user: string;
}

const NewUploadWizardModal = ({
    isOpen,
    onClose,
    initialData,
    file,
    productName,
    datasetName,
    user,
}: ModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepData,setStepData] = useState<{ [key: number]: any}>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            const enrichedInitialData = {
                ...initialData,
                producto_dato: productName,
                dataset_destino: datasetName,
                usuario: user,
            };
            setStepData({ 1: enrichedInitialData});
            setCurrentStep(1);
        }
    }, [initialData, productName, datasetName, user]);

    const sendLog = async (
        level: "info" | "error" | "warning",
        message: string,
        fileName?: string,
        dataset?: string,
        usuario?: string,
        productName?: string,
    ) => {
        try {
            await fetch(`https://data-products-backend-dev-697719423009.us-east4.run.app/api/logs/${level}`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    message,
                    user: usuario,
                    product: productName,
                    file_name: fileName,
                    dataset: dataset,
                }),
            });
        } catch (err) {
            console.error("Error enviando log", err);
        }
    };

    const fetchStepData = async (step: number) => {
        if (!file) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("step", String(step));

        try {
            const response = await fetch("https://data-products-backend-dev-697719423009.us-east4.run.app/api/storage/analyze", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setStepData((prev) => ({...prev, [step]: data}));
            setCurrentStep(step);
        } catch (error: any) {
            alert(`Error al cargar datos del paso ${step}: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    const handleNext = () => {
        const nextStep = currentStep + 1;
        if (stepData[nextStep]) {
            setCurrentStep(nextStep);
        } else {
            fetchStepData(nextStep);
        }
    }

    const handlePrevious = () => setCurrentStep((prev) => prev - 1);

    const handleFinalIngest = async () => {
        if (!file) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("destination", productName + "/" + file.name.split(".")[0]);

        try {
            const response = await fetch("https://data-products-backend-dev-697719423009.us-east4.run.app/api/storage/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            await sendLog(
                "info",
                `El archivo ${file.name} fue cargado exitosamente`,
                file.name, datasetName, user, productName
            );

            onClose();
        } catch (error: any) {
            await sendLog(
                "error",
                `Error al cargar archivo ${file?.name}: ${error.message}`,
                datasetName, user, productName
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-[--color-gris-claro] rounded-xl shadow-2xl p-8 w-full max-w-3xl h-[540px] flex flex-col">
                <Stepper isNuevo={true} currentStep={currentStep} />
                <div className="flex-grow mt-4">
                    {currentStep === 1 && <Step1Confirmation data={stepData[1]} />}
                    {currentStep === 2 && <Step2Structure data={stepData[2]} />}
                </div>
                <hr className="border-black" />
                <div className="flex justify-between items-center mt-6">
                    <button
                    // onClick={onclose}
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
                        {currentStep < 2 ? (
                            <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="rounded-md bg-[#F46546] py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400"
                            >
                                {isLoading ? "Cargando ...": "Siguiente"}
                            </button>
                        ) : (
                            <button
                            onClick={handleFinalIngest}
                            disabled={isLoading}
                            className="rounded-md bg-red-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:bg-gray-400s"
                            >
                                {isLoading ? "Procesando Ingesta ..." : "Confirmar Ingesta"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewUploadWizardModal;