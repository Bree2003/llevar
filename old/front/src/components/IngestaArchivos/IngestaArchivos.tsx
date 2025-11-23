// src/components/IngestaArchivos/IngestaArchivos.tsx

import { useState } from "react";
import FileInput from "components/FileInput/FileInput"; // Renombrado para mayor claridad
import UploadWizardModal from "./UploadWizardModal";

export default function IngestaArchivos() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analysisData, setAnalysisData] = useState(null); // Para guardar los datos del paso 1
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Ahora esta función inicia el análisis, no la subida final
    const handleStartAnalysis = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo antes de ejecutar.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('step', '1'); // <-- Siempre empezamos con el paso 1

        try {
            // Llamamos al nuevo endpoint de análisis
            const response = await fetch('http://127.0.0.1:5000/api/storage/analyze', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocurrió un error al analizar el archivo.');
            }

            // Si todo va bien, guardamos los datos del paso 1 y abrimos el modal
            setAnalysisData(data);
            setIsModalOpen(true);

        } catch (error: any) {
            setErrorMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAnalysisData(null); // Limpiamos los datos al cerrar
    };

    return (
        <div>
            <h2 className="font-bold text-left text-2xl mb-10">Ingesta de Archivos</h2>

            <form className="space-y-6" onSubmit={handleStartAnalysis}>
                {/* ... Fila 1: Dataset destino ... */}
                
                <div className="flex items-center">
                    <label className="w-40 shrink-0 text-gray-700">Cargar archivo</label>
                    <div className="flex-grow">
                        <FileInput onFileSelect={setSelectedFile} />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-md bg-[#F46546] py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analizando...' : 'Ejecutar'}
                    </button>
                </div>
            </form>
            
            {errorMessage && (
                <div className="mt-4 p-4 rounded-md text-sm bg-red-100 text-red-700">
                    {errorMessage}
                </div>
            )}

            {/* El modal se renderiza aquí pero solo es visible cuando isOpen es true */}
            <UploadWizardModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={analysisData}
                file={selectedFile}
            />
        </div>
    );
}