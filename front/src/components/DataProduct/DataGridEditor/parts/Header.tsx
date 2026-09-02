import { useEffect, useRef, useState } from "react";

import Skeleton from "react-loading-skeleton";

interface DataGridHeaderProps {
  loading?: boolean;
  tableName?: string;

  pageSize: number;

  setPageSize: (size: number) => void;

  visibleColumns: string[];
  headers: string[];

  setVisibleColumns: (cols: string[]) => void;
}

export const DataGridHeader = ({
  loading,
  tableName,
  pageSize,
  setPageSize,
  visibleColumns,
  headers,
  setVisibleColumns,
}: DataGridHeaderProps) => {
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  const [isColSelectorOpen, setIsColSelectorOpen] = useState(false);

  const sizeRef = useRef<HTMLDivElement>(null);

  const colRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut = (event: MouseEvent) => {
      if (sizeRef.current && !sizeRef.current.contains(event.target as Node)) {
        setIsPageSizeOpen(false);
      }

      if (colRef.current && !colRef.current.contains(event.target as Node)) {
        setIsColSelectorOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOut);

    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  const toggleCol = (column: string) => {
    const newSet = new Set(visibleColumns);

    if (newSet.has(column)) {
      newSet.delete(column);
    } else {
      newSet.add(column);
    }

    setVisibleColumns(headers.filter((header) => newSet.has(header)));
  };

  return (
    <header
      className="
        w-full

        mb-6
        md:mb-8

        flex
        flex-col
        lg:flex-row

        lg:items-end
        lg:justify-between

        gap-5
      "
    >
      <div className="min-w-0">
        <h1
          className="
            text-3xl
            md:text-4xl
            xl:text-5xl

            font-bold

            text-[--color-accent]

            break-words
          "
        >
          {loading ? <Skeleton width={300} /> : `Tabla ${tableName || ""}`}
        </h1>

        {!loading && (
          <p
            className="
              mt-3
              md:mt-4

              max-w-3xl

              text-sm
              md:text-base

              text-[--color-text-secondary]
            "
          >
            Consulta, filtra y administra los registros almacenados en esta
            tabla.
          </p>
        )}
      </div>

      {!loading && (
        <div
          className="
            w-full
            lg:w-auto

            flex
            flex-col
            sm:flex-row

            gap-3

            flex-shrink-0
          "
        >
          {/* PAGE SIZE */}
          <div
            ref={sizeRef}
            className="
              relative
              w-full
              sm:w-auto
            "
          >
            <button
              type="button"
              onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
              className="
                w-full
                sm:w-auto

                flex
                items-center
                justify-center
                gap-2

                px-4
                py-2.5

                rounded-[10px]

                border
                border-[--color-border]

                bg-white

                text-sm
                font-medium
                text-[--color-text-secondary]

                hover:bg-[--color-background]
                hover:text-[--color-accent]

                transition-colors

                whitespace-nowrap
              "
            >
              Registros: {pageSize}
              <span className="text-xs">▾</span>
            </button>

            {isPageSizeOpen && (
              <div
                className="
                  absolute

                  top-[calc(100%+8px)]

                  left-0
                  sm:left-auto
                  sm:right-0

                  z-50

                  w-full
                  sm:w-44

                  overflow-hidden

                  rounded-xl

                  border
                  border-[--color-border]

                  bg-white

                  shadow-xl
                "
              >
                {[50, 100, 200].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPageSize(size);

                      setIsPageSizeOpen(false);
                    }}
                    className={`
                        w-full

                        px-4
                        py-2.5

                        text-left
                        text-sm

                        transition-colors

                        ${
                          pageSize === size
                            ? "bg-[--color-accent-light] text-[--color-accent] font-semibold"
                            : "text-[--color-text-secondary] hover:bg-[--color-background]"
                        }
                      `}
                  >
                    {size} registros
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN SELECTOR */}
          <div
            ref={colRef}
            className="
              relative
              w-full
              sm:w-auto
            "
          >
            <button
              type="button"
              onClick={() => setIsColSelectorOpen(!isColSelectorOpen)}
              className="
                w-full
                sm:w-auto

                flex
                items-center
                justify-center
                gap-2

                px-4
                py-2.5

                rounded-[10px]

                border
                border-[--color-border]

                bg-white

                text-sm
                font-medium
                text-[--color-text-secondary]

                hover:bg-[--color-background]
                hover:text-[--color-accent]

                transition-colors

                whitespace-nowrap
              "
            >
              Columnas ({visibleColumns.length})
              <span className="text-xs">▾</span>
            </button>

            {isColSelectorOpen && (
              <div
                className="
                  absolute

                  top-[calc(100%+8px)]

                  left-0
                  sm:left-auto
                  sm:right-0

                  z-50

                  w-full
                  sm:w-72

                  max-w-[calc(100vw-2rem)]

                  rounded-xl

                  border
                  border-[--color-border]

                  bg-white

                  shadow-xl

                  overflow-hidden
                "
              >
                <div
                  className="
                    px-4
                    py-3

                    flex
                    items-center
                    justify-between

                    bg-[--color-background]

                    border-b
                    border-[--color-border]
                  "
                >
                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      text-[--color-text-secondary]
                    "
                  >
                    Mostrar / ocultar
                  </span>

                  <button
                    type="button"
                    onClick={() => setVisibleColumns(headers)}
                    className="
                      text-xs
                      font-semibold
                      text-[--color-accent]
                    "
                  >
                    Todas
                  </button>
                </div>

                <div
                  className="
                    max-h-64
                    overflow-y-auto

                    p-2
                  "
                >
                  {headers.map((column) => (
                    <label
                      key={column}
                      className="
                          flex
                          items-center
                          gap-3

                          px-3
                          py-2.5

                          rounded-lg

                          cursor-pointer

                          hover:bg-[--color-background]
                        "
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(column)}
                        onChange={() => toggleCol(column)}
                        className="
                            w-4
                            h-4

                            accent-[--color-accent]

                            cursor-pointer
                          "
                      />

                      <span
                        className="
                            min-w-0

                            text-sm

                            text-[--color-text-secondary]

                            truncate
                          "
                      >
                        {column}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
