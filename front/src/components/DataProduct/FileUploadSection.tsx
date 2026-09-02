import { useEffect, useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!uploadState.file && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadState.file]);

  return (
    <div className="w-full max-w-3xl">
      <div className="flex flex-col gap-6">
        {/* MODO */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[160px_minmax(0,1fr)]
            gap-3
            md:gap-5
            md:items-center
          "
        >
          <label
            className="
              text-sm
              md:text-base

              font-semibold

              text-[--color-text-primary]
            "
          >
            Modo de ingesta
          </label>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >
            <label
              className={`
                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-xl

                border

                cursor-pointer

                transition-colors

                ${
                  !isNewTable
                    ? "border-[--color-accent] bg-[--color-accent-light]"
                    : "border-[--color-border] bg-white hover:bg-[--color-background]"
                }
              `}
            >
              <input
                type="radio"
                checked={!isNewTable}
                onChange={() => {
                  setIsNewTable(false);
                  onTableChange("");
                }}
                className="
                  w-4
                  h-4

                  accent-[--color-accent]

                  cursor-pointer
                "
              />

              <span className="text-sm font-medium text-[--color-text-primary]">
                Tabla existente
              </span>
            </label>

            <label
              className={`
                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-xl

                border

                cursor-pointer

                transition-colors

                ${
                  isNewTable
                    ? "border-[--color-accent] bg-[--color-accent-light]"
                    : "border-[--color-border] bg-white hover:bg-[--color-background]"
                }
              `}
            >
              <input
                type="radio"
                checked={isNewTable}
                onChange={() => {
                  setIsNewTable(true);
                  onTableChange("");
                }}
                className="
                  w-4
                  h-4

                  accent-[--color-accent]

                  cursor-pointer
                "
              />

              <span className="text-sm font-medium text-[--color-text-primary]">
                Nueva tabla
              </span>
            </label>
          </div>
        </div>

        {/* TABLA */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[160px_minmax(0,1fr)]
            gap-3
            md:gap-5
            md:items-center
          "
        >
          <label className="text-sm md:text-base font-semibold text-[--color-text-primary]">
            {isNewTable ? "Nombre de tabla" : "Tabla destino"}
          </label>

          {isNewTable ? (
            <input
              type="text"
              placeholder="Ej: maestro-ceco"
              value={uploadState.selectedTable}
              onChange={(event) => onTableChange(event.target.value)}
              className="
                w-full

                px-4
                py-2.5

                rounded-[10px]

                bg-white

                border
                border-[--color-border]

                text-sm
                text-[--color-text-primary]

                outline-none

                focus:border-[--color-accent]
                focus:ring-2
                focus:ring-[--color-accent-light]

                transition-all
              "
            />
          ) : (
            <select
              value={uploadState.selectedTable}
              onChange={(event) => onTableChange(event.target.value)}
              className="
                w-full

                px-4
                py-2.5

                rounded-[10px]

                bg-white

                border
                border-[--color-border]

                text-sm
                text-[--color-text-primary]

                outline-none

                focus:border-[--color-accent]
                focus:ring-2
                focus:ring-[--color-accent-light]

                transition-all
              "
            >
              <option value="">Selecciona una tabla</option>

              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ARCHIVO */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[160px_minmax(0,1fr)]
            gap-3
            md:gap-5
            md:items-center
          "
        >
          <label className="text-sm md:text-base font-semibold text-[--color-text-primary]">
            Cargar archivo
          </label>

          <div className="min-w-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              onChange={(event) => {
                if (event.target.files && event.target.files.length > 0) {
                  onFileChange(event.target.files[0]);
                }
              }}
            />

            <div
              className="
                flex
                flex-col
                sm:flex-row

                sm:items-center

                gap-3
              "
            >
              <button
                type="button"
                onClick={handleCustomClick}
                className="
                  w-full
                  sm:w-auto

                  px-4
                  py-2.5

                  rounded-[10px]

                  border
                  border-[--color-border]

                  bg-white

                  text-sm
                  font-semibold

                  text-[--color-accent]

                  hover:bg-[--color-accent-light]

                  transition-colors

                  whitespace-nowrap
                "
              >
                Seleccionar archivo
              </button>

              <span
                className="
                  min-w-0

                  text-sm

                  text-[--color-text-secondary]

                  truncate
                "
              >
                {uploadState.file
                  ? uploadState.file.name
                  : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>
        </div>

        {/* BOTÓN */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[160px_minmax(0,1fr)]
            gap-3
            md:gap-5
          "
        >
          <div className="hidden md:block" />

          <button
            type="button"
            onClick={onAction}
            disabled={!uploadState.file || !uploadState.selectedTable}
            className="
              w-full

              px-5
              py-3

              rounded-[10px]

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold

              hover:opacity-90

              transition-opacity

              disabled:bg-gray-200
              disabled:text-gray-400
              disabled:cursor-not-allowed
            "
          >
            Analizar e ingestar
          </button>
        </div>
      </div>

      {isNewTable && (
        <AlertMessage variant="compact" className="mt-5">
          <span>
            El nombre de la tabla incluirá automáticamente el prefijo tbl_.
          </span>
        </AlertMessage>
      )}
    </div>
  );
}
