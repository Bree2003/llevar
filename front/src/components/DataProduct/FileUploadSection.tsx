import { useRef, useEffect, useState } from "react"; // 1. Importar hooks
import { UploadState } from "controllers/Ingest/FolderListController";

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
  
  // 2. Crear la referencia al input
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  // 3. Efecto para limpiar el input nativo cuando el estado se reinicia
  useEffect(() => {
    // Si en el estado no hay archivo, pero el input tiene valor, límpialo.
    if (!uploadState.file && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadState.file]);

  return (
    <div className="border-b mb-8 pb-8">
      <h2 className="font-bold text-left text-2xl mb-6 text-gray-800">
        Nueva Ingesta
      </h2>

      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-8 mb-4">
          <label htmlFor="" className="w-40 shrink-0 text-gray-700 font-medium">Modo de Ingesta</label>
          <div className="flex gap-4">
            <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="" id="" 
              checked={!isNewTable}
              onChange={() => {setIsNewTable(false); onTableChange("");}}
              className="text-orange-500 focus:ring-orange-500" />
              <span className="text-sm text-gray-700">Tabla Existente</span>
            </label>
            <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="" id="" 
              checked={isNewTable}
              onChange={() => {setIsNewTable(true); onTableChange("");}}
              className="text-orange-500 focus:ring-orange-500" />
              <span className="text-sm text-gray-700">Nueva Tabla</span>
            </label>
          </div>
        </div>
        {/* Selector de Tabla */}
        <div className="flex items-center">
          <label className="w-40 shrink-0 text-gray-700 font-medium">
            {isNewTable ? "Nombre de Tabla" : "Tabla Destino"}
          </label>
          {isNewTable ? (
            <input type="text" name="" id=""
            placeholder="Ej: maestro_ceco"
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

        {/* Input Archivo */}
        <div className="flex items-center">
          <label className="w-40 shrink-0 text-gray-700 font-medium">
            Cargar archivo
          </label>
          <input
            // 4. Asignar la referencia aquí
            ref={fileInputRef} 
            type="file"
            accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#F46546] hover:file:bg-orange-100 cursor-pointer"
            onChange={(e) => {
              // Verificamos que existan files antes de llamar
              if (e.target.files && e.target.files.length > 0) {
                onFileChange(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Botón */}
        <div className="flex justify-start pl-40 pt-2">
          <button
            onClick={onAction}
            disabled={!uploadState.file || !uploadState.selectedTable}
            className="rounded-md bg-[#F46546] py-2.5 px-8 text-sm font-bold text-white shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Analizar e Ingestar
          </button>
        </div>
      </div>
    </div>
  );
}