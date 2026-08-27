import { useRef, useEffect } from "react";
import { UploadState } from "controllers/Ingest/FolderListController";
import AlertMessage from "components/UI/AlertMessage";

interface Table {
  id: string;
  label: string;
}

interface FileUploadSectionProps {
  tables: Table[];
  uploadState: UploadState;
  onFileChange: (file: File | null) => void;
  onTableChange: (tableId: string) => void;
  onAction: () => void;
  isNewTable: boolean;
  setIsNewTable: (val: boolean) => void;
}

export default function FileUploadSection({
  tables,
  uploadState,
  onFileChange,
  onTableChange,
  onAction,
  isNewTable,
  setIsNewTable,
}: FileUploadSectionProps) {
  
  // Referencia al input real (oculto)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para activar el click del input oculto
  const handleCustomClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!uploadState.file && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadState.file]);

  return (
    <div className="mb-4 pb-0"> 

      <div className="space-y-6 max-w-2xl">
        
        {/* 1. Selector de Modo */}
<div className="flex mb-4 text-start items-center">
  <label className="w-40 shrink-0 text-gray-700 font-medium">Modo de ingesta</label>
  <div className="flex gap-4">
    
    {/* Opción: Tabla Existente */}
    <label className="flex items-center gap-2 cursor-pointer group">
      <input 
        type="radio" 
        checked={!isNewTable}
        onChange={() => {setIsNewTable(false); onTableChange("");}}
        className="h-4 w-4 border-gray-300 text-[#F46546] focus:ring-[#F46546] accent-[#F46546] cursor-pointer transition-all" 
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
        Tabla existente
      </span>
    </label>

    {/* Opción: Nueva Tabla */}
    <label className="flex items-center gap-2 cursor-pointer group">
      <input 
        type="radio" 
        checked={isNewTable}
        onChange={() => {setIsNewTable(true); onTableChange("");}}
        className="h-4 w-4 border-gray-300 text-[#F46546] focus:ring-[#F46546] accent-[#F46546] cursor-pointer transition-all" 
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
        Nueva tabla
      </span>
    </label>
    
  </div>
</div>

        {/* 2. Selector de Tabla / Nombre */}
        <div className="flex items-center text-start">
          <label className="w-40 shrink-0 text-gray-700 font-medium">
            {isNewTable ? "Nombre de tabla" : "Tabla destino"}
          </label>
          {isNewTable ? (
            <input 
              type="text" 
              placeholder="Ej: maestro-ceco"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2 px-3 border"
              value={uploadState.selectedTable}
              onChange={(e) => onTableChange(e.target.value)}
            />
          ) : (
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2"
              value={uploadState.selectedTable}
              onChange={(e) => onTableChange(e.target.value)}
            >
              <option value="">-- Selecciona una tabla --</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 3. INPUT DE ARCHIVO PERSONALIZADO (Componente Fantasma) */}
        <div className="flex items-center text-start">
          <label className="w-40 shrink-0 text-gray-700 font-medium">
            Cargar archivo
          </label>
          
          <div className="w-full">
            {/* A. El Input Real: Está oculto (hidden) pero funciona */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onFileChange(e.target.files[0]);
                }
              }}
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCustomClick}
                className="px-4 py-2 rounded-full bg-orange-50 text-[#F46546] text-sm font-semibold hover:bg-orange-100 transition-colors border border-orange-100 shadow-sm active:scale-95"
              >
                Seleccionar archivo
              </button>
              
              <span className="text-sm text-gray-500 italic truncate max-w-[200px]">
                {uploadState.file 
                  ? uploadState.file.name 
                  : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Botón de Acción */}
       <div className="flex items-center mt-6">
  <div className="w-40 shrink-0"></div> 
  
  <button
    onClick={onAction}
    disabled={!uploadState.file || !uploadState.selectedTable}
    className="w-full rounded-lg bg-[#F46546] py-3 px-8 text-sm font-bold text-white shadow-md hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
  >
    Analizar e ingestar
  </button>
</div>
      </div>
      {isNewTable && <AlertMessage variant="compact" className="mt-4">
          <span>El nombre de la tabla incluirá automáticamente el prefijo tbl_.</span>
      </AlertMessage>}
    </div>
  );
}