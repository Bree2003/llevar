import { MouseEventHandler } from "react";

import Skeleton from "react-loading-skeleton";

interface Table {
  id: string;
  label: string;
}

interface ProductSidebarProps {
  envId?: string;
  productName?: string;
  tables: Table[];
  loading?: boolean;
  onSelectTable: (tableId: string) => void;
  onBack: MouseEventHandler<HTMLButtonElement>;
}

export default function ProductSidebar({
  envId,
  productName,
  tables,
  loading,
  onSelectTable,
  onBack,
}: ProductSidebarProps) {
  const getSapModuleLabel = (bucketName: string): string => {
    const parts = bucketName.split("-");
    const code = parts[3];

    if (code && code.length <= 3) {
      return `Módulo ${code.toUpperCase()}`;
    }

    return bucketName;
  };

  const formatLabel = (text: string): string => {
    if (!text) return "";

    if (text.length === 3) {
      return text.toUpperCase();
    }

    const cleanText = text.replace(/-/g, " ");

    const connectors = ["de", "del", "el", "la", "los", "las", "en", "y", "o"];

    return cleanText
      .split(" ")
      .map((word, index) => {
        if (index > 0 && connectors.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const displayName =
    envId === "sap"
      ? getSapModuleLabel(productName || "")
      : formatLabel(productName || "");

  return (
    <aside
      className="
        w-full
        lg:w-[270px]
        xl:w-[290px]

        lg:flex-shrink-0

        bg-white

        border-b
        lg:border-b-0
        lg:border-r
        border-[--color-border]

        text-left

        self-stretch

        lg:h-full

        overflow-hidden
      "
    >
      <div
        className="
          w-full
          h-full

          flex
          flex-col

          p-4
          md:p-5
          lg:p-6

          overflow-hidden
        "
      >
        {loading ? (
          <>
            {/* TÍTULO SKELETON */}
            <div className="flex-shrink-0">
              <Skeleton height={25} width="75%" />

              <div
                className="
                  border-t
                  border-[--color-border]

                  my-5
                "
              />
            </div>

            {/* TABLAS SKELETON */}
            <div
              className="
                flex-1
                min-h-0

                overflow-y-auto

                [&::-webkit-scrollbar]:hidden
              "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <Skeleton count={8} height={34} />
            </div>

            {/* VOLVER SKELETON */}
            <div
              className="
                flex-shrink-0

                border-t
                border-[--color-border]

                mt-5
                pt-5
              "
            >
              <Skeleton height={24} width="65%" />
            </div>
          </>
        ) : (
          <>
            {/* =========================================
                CABECERA FIJA
            ========================================== */}
            <div className="flex-shrink-0">
              <h2
                className="
                  text-lg
                  md:text-xl

                  font-bold

                  text-[--color-accent]

                  break-words
                "
              >
                {displayName}
              </h2>

              <div
                className="
                  border-t
                  border-[--color-border]

                  my-5
                "
              />

              <p
                className="
                  text-xs
                  font-bold
                  uppercase

                  tracking-wide

                  text-[--color-text-muted]
                "
              >
                Tablas disponibles
              </p>
            </div>

            {/* =========================================
                ZONA SCROLLEABLE
            ========================================== */}
            <div
              className="
                flex-1
                min-h-0

                mt-3

                overflow-y-auto
                overflow-x-hidden

                pr-1

                [&::-webkit-scrollbar]:hidden
              "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {tables.length > 0 ? (
                <div
                  className="
                    flex
                    flex-col

                    gap-2
                  "
                >
                  {tables.map((table) => (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() => onSelectTable(table.id)}
                      className="
                          w-full

                          flex-shrink-0

                          px-3
                          py-2.5

                          rounded-lg

                          text-sm
                          font-medium
                          text-left

                          text-[--color-text-secondary]

                          hover:bg-[--color-accent-light]
                          hover:text-[--color-accent]

                          transition-colors

                          break-words
                        "
                    >
                      {table.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p
                  className="
                    text-sm

                    text-[--color-text-secondary]
                  "
                >
                  No hay tablas en este producto.
                </p>
              )}
            </div>

            {/* =========================================
                BOTÓN INFERIOR FIJO
            ========================================== */}
            <div
              className="
                flex-shrink-0

                border-t
                border-[--color-border]

                mt-4
                pt-5
              "
            >
              <button
                type="button"
                onClick={onBack}
                className="
                  flex
                  items-center

                  gap-2

                  text-sm
                  font-semibold

                  text-[--color-text-secondary]

                  hover:text-[--color-accent]

                  transition-colors
                "
              >
                <span className="text-lg">←</span>
                Volver a {envId === "sap" ? "módulos" : "productos de datos"}
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
