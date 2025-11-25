import { useState } from "react";
import FileInput from "components/FileInput/FileInput";
import UploadWizardModal from "./UploadWizardModal";
import * as storageService from "services/storage-old";
import NewUploadWizardModal from "./NewUploadWizardModal";

interface IngestaArchivosProps {
    productName: string;
    datasets: string[];
}

export default function IngestaArchivos({ productName, datasets }: IngestaArchivosProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // El estado inicial es `false` para que "Existente" esté seleccionado por defecto.
    const [isNuevo, setIsNuevo] = useState(false);

    const formatName = (text: string) => {
        return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleStartAnalysis = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo.");
            return;
        }
        if (!selectedDataset) {
            alert("Por favor, selecciona o ingresa un Dataset destino.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('step', '1');

        try {
            const response = await fetch('https://data-products-backend-dev-697719423009.us-east4.run.app/api/storage/analyze', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocurrió un error al analizar el archivo.');
            }

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
        setAnalysisData(null);
    };

    // --- NOVEDAD: Función para manejar el cambio de radio button ---
    const handleDatasetTypeChange = (isNew: boolean) => {
        setIsNuevo(isNew);
        // Limpiamos el valor del dataset seleccionado al cambiar de tipo
        // para evitar inconsistencias.
        setSelectedDataset(""); 
    };

    return (
        <div>
            <h2 className="font-bold text-left text-2xl mt-12 mb-10">Ingesta de Archivos</h2>

            <form className="space-y-6" onSubmit={handleStartAnalysis}>
                <div className="flex items-center">
                    <label className="w-40 shrink-0 text-gray-700">Dataset destino</label>
                    <div className="flex-grow flex items-center gap-4">
                        <div className={!isNuevo ? "w-48" : "w-72"}>
                            {!isNuevo ? (
                                <select
                                    value={selectedDataset}
                                    onChange={(e) => setSelectedDataset(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                >
                                    <option value="">Escoger</option>
                                    {datasets.map(ds => (
                                        <option key={ds} value={ds}>
                                            {formatName(ds)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    type="text" // Corregido de "tex" a "text"
                                    value={selectedDataset}
                                    onChange={(e) => setSelectedDataset(e.target.value)} 
                                    className="w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm sm:text-sm h-10 px-3" 
                                    placeholder="Ingresa el nombre de tu nuevo Dataset" 
                                />
                            )}
                        </div>

                        {/* --- CORRECCIÓN: Radio buttons con manejo de estado mejorado --- */}
                        <div className="flex items-center gap-5 ml-4">
                            <div className="flex items-center">
                                {/* El `htmlFor` apunta al `id` del input para que al hacer clic en el label se seleccione el radio */}
                                <label htmlFor="existente" className="flex items-center gap-2 cursor-pointer text-sm text-gray-900">
                                    <input
                                        id="existente"
                                        name="dataset-type"
                                        type="radio"
                                        // `checked` está controlado por el estado. Será true cuando `isNuevo` sea false.
                                        checked={!isNuevo}
                                        // `onChange` establece el estado a `false`.
                                        onChange={() => handleDatasetTypeChange(false)}
                                        className="h-4 w-4 accent-[#F46546]"
                                    />
                                    Existente
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="nuevo" className="flex items-center gap-2 cursor-pointer text-sm text-gray-900">
                                    <input
                                        id="nuevo"
                                        name="dataset-type"
                                        type="radio"
                                        // `checked` está controlado por el estado. Será true cuando `isNuevo` sea true.
                                        checked={isNuevo}
                                        // `onChange` establece el estado a `true`.
                                        onChange={() => handleDatasetTypeChange(true)}
                                        className="h-4 w-4 accent-[#F46546]"
                                    />
                                    Nuevo
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <label className="w-40 shrink-0 text-gray-700">Cargar archivo</label>
                    <div className="flex-grow">
                        <FileInput onFileSelect={setSelectedFile} />
                    </div>
                </div>

                <div className="flex justify-start">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-md bg-[#F46546] py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analizando...' : 'Ejecutar'}
                    </button>
                </div>
            </form>

            {errorMessage && <div className="text-red-600 mt-4">{errorMessage}</div>}

            {isNuevo && isModalOpen ? (
                <NewUploadWizardModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    initialData={analysisData}
                    file={selectedFile}
                    productName={productName}
                    datasetName={selectedDataset}
                    user="bsandovalh"
                />
            ) : (
                <UploadWizardModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    initialData={analysisData}
                    file={selectedFile}
                    productName={productName}
                    datasetName={selectedDataset}
                    user="bsandovalh"
                />
            )}
        </div>
    );
}