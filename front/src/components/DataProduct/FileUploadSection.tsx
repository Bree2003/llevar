import { UploadState } from "controllers/Ingest/FolderListController";

// El modelo de una tabla individual
interface Table {
  id: string;
  label: string;
}

interface FileUploadSectionProps {
  tables: Table[];
  uploadState: UploadState;
  onFileChange: (file: File | null) => void;
  onTableChange: (tableId: string) => void;
  onUpload: () => void;
  onReset: () => void; // Para resetear el formulario después del éxito
}

export default function FileUploadSection({ tables, uploadState, onFileChange, onTableChange, onUpload, onReset }: FileUploadSectionProps) {

  // Si la carga fue exitosa, mostramos una pantalla de confirmación
  if (uploadState.uploadSuccess) {
    return (
      <div className="text-center py-10 border-t mt-10">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800">¡Archivo Cargado!</h3>
        <p className="text-gray-600 text-sm mt-2">El archivo se ha subido correctamente y está siendo procesado.</p>
        <button onClick={onReset} className="mt-6 bg-[#F46546] py-2 px-8 text-sm font-medium text-white shadow-sm rounded-md hover:bg-opacity-90">
          Ingestar otro archivo
        </button>
      </div>
    );
  }

  // Si no, mostramos el formulario de carga
  return (
    <div className="border-t">
      <h2 className="font-bold text-left text-2xl mt-12 mb-10">Ingesta de Archivos</h2>

      <div className="space-y-6">
        {/* 1. Selector de Tabla Destino */}
        <div className="flex items-center">
          <label className="w-40 shrink-0 text-gray-700">Tabla Destino</label>
          <select
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            value={uploadState.selectedTable}
            onChange={(e) => onTableChange(e.target.value)}
            disabled={uploadState.isUploading}
          >
            <option value="">-- Selecciona una tabla --</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        
        {/* 2. Input de Archivo */}
        <div className="flex items-center">
            <label className="w-40 shrink-0 text-gray-700">Cargar archivo</label>
            <input
              type="file"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#F46546] hover:file:bg-orange-100"
              onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
              disabled={uploadState.isUploading}
            />
        </div>

        {/* 3. Barra de Progreso y Botón de Acción */}
        {uploadState.isUploading && (
          <div className="pl-40">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#F46546] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1 text-gray-500">{uploadState.progress}%</p>
          </div>
        )}

        <div className="flex justify-start pl-40">
            <button
              onClick={onUpload}
              disabled={!uploadState.file || !uploadState.selectedTable || uploadState.isUploading}
              className="rounded-md bg-[#F46546] py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadState.isUploading ? 'Subiendo...' : 'Ejecutar Ingesta'}
            </button>
        </div>
      </div>
    </div>
  );
}