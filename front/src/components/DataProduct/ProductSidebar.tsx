import { MouseEventHandler } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useParams } from "react-router-dom";

interface Table {
  id: string;
  label: string;
}

interface ProductSidebarProps {
  productName?: string;
  tables: Table[];
  loading?: boolean;
  onSelectTable: (tableId: string) => void;
  onBack: MouseEventHandler<HTMLButtonElement>;
}

export default function ProductSidebar({
  productName,
  tables,
  loading,
  onSelectTable,
  onBack,
}: ProductSidebarProps) {
  const { envId } = useParams<{
    envId: string;
  }>();

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
    lg:border-r
    border-[--color-border]

    text-left

    self-stretch

    lg:min-h-[calc(100dvh-85.33px)]
  "
    >
      <div
        className="
          w-full

          p-4
          md:p-5
          lg:p-6
        "
      >
        {loading ? (
          <>
            <Skeleton height={25} width="75%" />

            <div
              className="
                border-t
                border-[--color-border]

                my-5
              "
            />

            <Skeleton count={4} height={34} />
          </>
        ) : (
          <>
            {/* TÍTULO */}
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

            {/* TABLAS */}
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

            {tables.length > 0 ? (
              <div
                className="
                  mt-3

                  flex
                  lg:flex-col

                  gap-2

                  overflow-x-auto
                  lg:overflow-visible

                  pb-2
                  lg:pb-0
                "
              >
                {tables.map((table) => (
                  <button
                    key={table.id}
                    type="button"
                    onClick={() => onSelectTable(table.id)}
                    className="
                        flex-shrink-0

                        lg:w-full

                        px-3
                        py-2.5

                        rounded-lg

                        text-sm
                        font-medium
                        text-left

                        text-[--color-text-secondary]

                        bg-[--color-background]
                        lg:bg-transparent

                        hover:bg-[--color-accent-light]
                        hover:text-[--color-accent]

                        transition-colors

                        whitespace-nowrap
                        lg:whitespace-normal
                      "
                  >
                    {table.label}
                  </button>
                ))}
              </div>
            ) : (
              <p
                className="
                  mt-3

                  text-sm

                  text-[--color-text-secondary]
                "
              >
                No hay tablas en este producto.
              </p>
            )}

            {/* VOLVER */}
            <div
              className="
                border-t
                border-[--color-border]

                mt-5
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
