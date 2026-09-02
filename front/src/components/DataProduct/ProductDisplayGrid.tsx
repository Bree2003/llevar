import React from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { ReactComponent as Calendar } from "components/Global/Icons/calendar.svg";
import { ReactComponent as Notification } from "components/Global/Icons/notification.svg";
import { ReactComponent as Mermas } from "components/Global/Icons/mermas.svg";
import { ReactComponent as MTS } from "components/Global/Icons/mts.svg";
import { ReactComponent as Stock } from "components/Global/Icons/stock.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";
import { ReactComponent as Download } from "components/Global/Icons/download.svg";

import DocAvisos from "assets/docs/Documentacion - PD - Avisos Mantenimiento.pdf";
import DocMermas from "assets/docs/Documentacion - PD - Mermas.pdf";
import DocPrograma from "assets/docs/Documentacion - PD - Programa Fabricacion.pdf";
import DocVersion from "assets/docs/Documentacion - PD - Version Fabricacion.pdf";

const GenericDatabaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
    />
  </svg>
);

interface Product {
  id: string;
  label: string;
}

interface ProductDisplayGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (productId: string) => void;
  bucketName?: string;
}

interface ProductConfig {
  description: string;
  icon: React.ComponentType<any>;
  file?: string;
  fileName?: string;
}

const PRODUCT_CONFIG: Record<string, ProductConfig> = {
  "programa-de-fabricacion": {
    description: "Plan o cronograma que organiza y controla la fabricación.",
    icon: Calendar,
    file: DocPrograma,
    fileName: "Documentacion-Programa-Fabricacion.pdf",
  },

  "version-de-fabricacion": {
    description:
      "Información asociada a las distintas versiones utilizadas dentro del proceso de fabricación.",
    icon: MTS,
    file: DocVersion,
    fileName: "Documentacion-Version-Fabricacion.pdf",
  },

  notificaciones: {
    description: "Registro semanal que consolida y valida la producción.",
    icon: Notification,
  },

  "avisos-de-mantenimiento": {
    description: "Información asociada a avisos de mantención correctiva.",
    icon: GenericDatabaseIcon,
    file: DocAvisos,
    fileName: "Documentacion-Avisos-Mantenimiento.pdf",
  },

  mermas: {
    description:
      "Información que permite medir y analizar las mermas de los insumos secos.",
    icon: Mermas,
    file: DocMermas,
    fileName: "Documentacion-Mermas.pdf",
  },

  mts: {
    description:
      "Sistema externo que almacena los tiempos asociados a los procesos de producción.",
    icon: MTS,
  },

  "stock-materiales": {
    description:
      "Información que permite consultar y gestionar el stock existente y solicitado.",
    icon: Stock,
  },

  "venta-exportacion": {
    description:
      "Información relacionada con el stock y procesos asociados a ventas y exportación.",
    icon: Export,
  },
};

const DEFAULT_CONFIG: ProductConfig = {
  description:
    "Producto de datos disponible para consulta y gestión dentro de la plataforma.",
  icon: GenericDatabaseIcon,
};

const ProductCardSkeleton = () => (
  <div
    className="
      w-full
      min-h-[240px]
      bg-white
      border
      border-[--color-border]
      rounded-2xl
      p-5
      md:p-6
    "
  >
    <div className="flex items-start justify-between gap-4">
      <Skeleton width={48} height={48} borderRadius={10} />

      <Skeleton width={90} height={26} borderRadius={8} />
    </div>

    <div className="mt-5">
      <Skeleton height={24} width="75%" />

      <div className="mt-3">
        <Skeleton count={2} />
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-[--color-border]">
      <Skeleton width={120} height={30} />
    </div>
  </div>
);

export default function ProductDisplayGrid({
  products,
  loading,
  onProductClick,
  bucketName,
}: ProductDisplayGridProps) {
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

  const formatBucketName = (text?: string) => {
    if (!text) return "";

    return text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const handleDownload = (
    event: React.MouseEvent,
    fileUrl: string,
    fileName: string,
  ) => {
    event.stopPropagation();

    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      {/* Header sección */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-end
          sm:justify-between
          gap-3
          mb-6
        "
      >
        <div>
          <h2
            className="
              text-xl
              md:text-2xl
              font-bold
              text-[--color-text-primary]
            "
          >
            {loading ? <Skeleton width={220} /> : "Productos disponibles"}
          </h2>

          {!loading && (
            <p
              className="
                mt-2
                text-sm
                md:text-base
                text-[--color-text-secondary]
              "
            >
              {bucketName
                ? `Productos de datos disponibles en ${formatBucketName(
                    bucketName,
                  )}.`
                : "Selecciona un producto para continuar."}
            </p>
          )}
        </div>

        {!loading && products.length > 0 && (
          <span
            className="
              w-fit
              px-3
              py-1.5
              rounded-full
              bg-white
              border
              border-[--color-border]
              text-xs
              md:text-sm
              font-medium
              text-[--color-text-secondary]
              whitespace-nowrap
            "
          >
            {products.length === 1
              ? "1 producto disponible"
              : `${products.length} productos disponibles`}
          </span>
        )}
      </div>

      {/* Grid */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-4
          gap-5
          md:gap-6
          xl:gap-8
          w-full
        "
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : products.length > 0 ? (
          products.map((product) => {
            const config = PRODUCT_CONFIG[product.id] || DEFAULT_CONFIG;

            const IconComponent = config.icon;

            return (
              <button
                type="button"
                key={product.id}
                onClick={() => onProductClick(product.id)}
                className="
                  group
                  w-full
                  min-w-0
                  min-h-[240px]

                  bg-white

                  p-5
                  md:p-6

                  rounded-2xl

                  text-left

                  border
                  border-[--color-border]

                  shadow-sm

                  hover:shadow-md
                  hover:-translate-y-0.5

                  transition-all
                  duration-200

                  flex
                  flex-col
                  justify-between
                "
              >
                <div>
                  {/* Header card */}
                  <div className="flex items-start justify-between gap-3">
                    {/* Icono */}
                    <div
                      className="
                        w-11
                        h-11
                        md:w-12
                        md:h-12

                        flex
                        items-center
                        justify-center

                        rounded-[10px]

                        bg-[--color-background]
                        text-[--color-accent]

                        flex-shrink-0

                        group-hover:bg-[--color-accent-light]

                        transition-colors
                      "
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Tipo */}
                    <span
                      className="
                        uppercase
                        h-fit

                        px-2.5
                        py-2

                        rounded-md

                        bg-[--color-background]

                        text-[10px]
                        sm:text-xs

                        font-medium

                        text-[--color-text-secondary]

                        whitespace-nowrap
                      "
                    >
                      Producto de datos
                    </span>
                  </div>

                  {/* Título */}
                  <h3
                    className="
                      mt-5

                      text-lg
                      md:text-xl

                      font-bold

                      text-[--color-text-primary]

                      leading-snug
                      break-words

                      group-hover:text-[--color-accent]

                      transition-colors
                    "
                  >
                    {formatLabel(product.label)}
                  </h3>

                  {/* Descripción */}
                  <p
                    className="
                      mt-3

                      text-sm
                      md:text-base

                      leading-relaxed

                      text-[--color-text-secondary]

                      line-clamp-3
                    "
                  >
                    {config.description}
                  </p>
                </div>

                {/* Footer */}
                <div
                  className="
                    mt-6
                    pt-4

                    border-t
                    border-[--color-border]

                    flex
                    flex-col
                    sm:flex-row

                    gap-3

                    sm:items-center
                    sm:justify-between
                  "
                >
                  {/* Documentación */}
                  {config.file ? (
                    <button
                      type="button"
                      onClick={(event) =>
                        handleDownload(
                          event,
                          config.file!,
                          config.fileName || "documentacion.pdf",
                        )
                      }
                      className="
                        w-full
                        sm:w-auto

                        flex
                        items-center
                        justify-center
                        gap-2

                        px-3
                        py-2

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
                      "
                    >
                      <Download className="w-4 h-4 flex-shrink-0" />
                      Documentación
                    </button>
                  ) : (
                    <span
                      className="
                        text-xs
                        text-[--color-text-muted]
                      "
                    >
                      Sin documentación
                    </span>
                  )}

                  {/* CTA principal */}
                  <span
                    className="
                      text-sm
                      font-semibold
                      text-[--color-accent]
                      whitespace-nowrap
                    "
                  >
                    Acceder →
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div
            className="
              col-span-full

              w-full

              py-10
              md:py-14
              px-5

              text-center

              bg-white

              rounded-2xl

              border
              border-[--color-border]
            "
          >
            <h3
              className="
                text-lg
                md:text-xl
                font-semibold
                text-[--color-text-primary]
              "
            >
              No se encontraron productos de datos
            </h3>

            <p
              className="
                mt-2
                text-sm
                md:text-base
                text-[--color-text-secondary]
              "
            >
              Esta fuente todavía no tiene productos de datos configurados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
