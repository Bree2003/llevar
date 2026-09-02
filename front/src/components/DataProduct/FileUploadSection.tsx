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
    <div className="mb-4 pb-0">
      <div
        className="
          space-y-6
          max-w-2xl
        "
      >
        {/* Modo */}
        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center

            gap-3
            sm:gap-0

            text-start
          "
        >
          <label
            className="
              sm:w-40
              sm:shrink-0

              text-[--color-text-secondary]

              font-medium
            "
          >
            Modo de ingesta
          </label>

          <div
            className="
              flex
              flex-col
              xs:flex-row
              sm:flex-row

              gap-3
              sm:gap-4
            "
          >
            {/* Existente */}
            <label
              className="
                flex
                items-center
                gap-2

                cursor-pointer

                group
              "
            >
              <input
                type="radio"
                checked={!isNewTable}
                onChange={() => {
                  setIsNewTable(false);

                  onTableChange("");
                }}
                className="
                  h-4
                  w-4

                  border-[--color-border]

                  accent-[var(--color-accent)]

                  cursor-pointer
                "
              />

              <span
                className="
                  text-sm
                  font-medium

                  text-[--color-text-secondary]

                  group-hover:text-[--color-text-primary]
                "
              >
                Tabla existente
              </span>
            </label>

            {/* Nueva */}
            <label
              className="
                flex
                items-center
                gap-2

                cursor-pointer

                group
              "
            >
              <input
                type="radio"
                checked={isNewTable}
                onChange={() => {
                  setIsNewTable(true);

                  onTableChange("");
                }}
                className="
                  h-4
                  w-4

                  border-[--color-border]

                  accent-[var(--color-accent)]

                  cursor-pointer
                "
              />

              <span
                className="
                  text-sm
                  font-medium

                  text-[--color-text-secondary]

                  group-hover:text-[--color-text-primary]
                "
              >
                Nueva tabla
              </span>
            </label>
          </div>
        </div>

        {/* Tabla */}
        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center

            gap-2
            sm:gap-0

            text-start
          "
        >
          <label
            className="
              sm:w-40
              sm:shrink-0

              text-[--color-text-secondary]

              font-medium
            "
          >
            {isNewTable ? "Nombre de tabla" : "Tabla destino"}
          </label>

          {isNewTable ? (
            <input
              type="text"
              placeholder="Ej: maestro-ceco"
              value={uploadState.selectedTable}
              onChange={(e) => onTableChange(e.target.value)}
              className="
                block
                w-full

                rounded-md

                border
                border-[--color-border]

                bg-white

                py-2
                px-3

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
              onChange={(e) => onTableChange(e.target.value)}
              className="
                block
                w-full

                rounded-md

                border
                border-[--color-border]

                bg-white

                py-2
                px-3

                text-sm

                text-[--color-text-primary]

                outline-none

                focus:border-[--color-accent]
                focus:ring-2
                focus:ring-[--color-accent-light]

                transition-all
              "
            >
              <option value="">-- Selecciona una tabla --</option>

              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Archivo */}
        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center

            gap-2
            sm:gap-0

            text-start
          "
        >
          <label
            className="
              sm:w-40
              sm:shrink-0

              text-[--color-text-secondary]

              font-medium
            "
          >
            Cargar archivo
          </label>

          <div className="w-full min-w-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
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
                  w-fit

                  px-4
                  py-2

                  rounded-full

                  bg-[--color-accent-light]

                  text-[--color-accent]

                  text-sm
                  font-semibold

                  hover:opacity-80

                  transition-opacity

                  border
                  border-[--color-border]
                "
              >
                Seleccionar archivo
              </button>

              <span
                className="
                  text-sm

                  text-[--color-text-muted]

                  italic

                  truncate

                  max-w-full
                  sm:max-w-[240px]
                "
              >
                {uploadState.file
                  ? uploadState.file.name
                  : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>
        </div>

        {/* Acción */}
        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center

            mt-6
          "
        >
          <div className="hidden sm:block sm:w-40 sm:shrink-0" />

          <button
            type="button"
            onClick={onAction}
            disabled={!uploadState.file || !uploadState.selectedTable}
            className="
              w-full

              rounded-lg

              bg-[--color-accent]

              py-3
              px-8

              text-sm
              font-bold
              text-white

              hover:opacity-90

              focus:outline-none
              focus:ring-2
              focus:ring-[--color-accent]
              focus:ring-offset-2

              disabled:bg-gray-200
              disabled:text-gray-400
              disabled:cursor-not-allowed

              transition-all

              active:scale-[0.98]
            "
          >
            Analizar e ingestar
          </button>
        </div>
      </div>

      {isNewTable && (
        <AlertMessage variant="compact" className="mt-4">
          <span>
            El nombre de la tabla incluirá automáticamente el prefijo tbl_.
          </span>
        </AlertMessage>
      )}
    </div>
  );
}
