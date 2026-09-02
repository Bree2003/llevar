import { ReactComponent as Calendar } from "components/Global/Icons/calendar.svg";
import { ReactComponent as Notification } from "components/Global/Icons/notification.svg";
import { ReactComponent as Mantenimiento } from "components/Global/Icons/mantenimiento.svg";
import { ReactComponent as Mermas } from "components/Global/Icons/mermas.svg";
import { ReactComponent as MTS } from "components/Global/Icons/mts.svg";
import { ReactComponent as Stock } from "components/Global/Icons/stock.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Product {
  id: string;
  label: string;
}

interface DataProductProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (id: string) => void;
}

const productIcons: Record<string, React.ComponentType<any>> = {
  programa_fabricacion: Calendar,
  notificaciones: Notification,
  avisos_mantenimiento: Mantenimiento,
  mermas: Mermas,
  mts: MTS,
  stock_materiales: Stock,
  venta_exportacion: Export,
};

const environmentDescriptions: Record<string, string> = {
  dominio_de_origen:
    "Fuentes transversales utilizadas por más de un producto de datos.",

  dominio_de_negocio:
    "Fuentes propias y específicas de cada producto de datos.",
};

const ProductCardSkeleton = () => (
  <div
    className="
      w-full
      min-h-[180px]
      bg-[--color-background]
      border
      border-[--color-border]
      rounded-2xl
      p-5
      md:p-6
    "
  >
    <div className="flex items-center gap-4 mb-5">
      <Skeleton width={48} height={48} borderRadius={12} />

      <div className="flex-1">
        <Skeleton height={24} width="70%" />
      </div>
    </div>

    <Skeleton count={2} />
  </div>
);

export default function DataProduct({
  products,
  loading,
  onProductClick,
}: DataProductProps) {
  return (
    <div
      className="
        w-full
        min-w-0
        bg-white
        border
        border-[--color-border]
        rounded-2xl
        p-5
        md:p-6
        lg:p-7
      "
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2
            className="
              text-xl
              md:text-2xl
              font-bold
              text-[--color-text-primary]
            "
          >
            {loading ? <Skeleton width={220} /> : "Principales dominios"}
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
              Selecciona el dominio sobre el que deseas gestionar información.
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
              bg-[--color-background]
              text-xs
              md:text-sm
              font-medium
              text-[--color-text-secondary]
              whitespace-nowrap
            "
          >
            {products.length === 1
              ? "1 dominio"
              : `${products.length} dominios`}
          </span>
        )}
      </div>

      {/* Separador */}
      <div className="w-full border-t border-[--color-border] mt-5 mb-6" />

      {/* Cards */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          2xl:grid-cols-3
          gap-4
          md:gap-5
          w-full
        "
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : products.length === 0 ? (
          <div
            className="
              col-span-full
              py-10
              md:py-14
              text-center
            "
          >
            <h3 className="text-lg font-semibold text-[--color-text-primary]">
              No hay dominios disponibles
            </h3>

            <p className="mt-2 text-sm md:text-base text-[--color-text-secondary]">
              No se encontraron dominios habilitados para realizar ingestas.
            </p>
          </div>
        ) : (
          products.map((product) => {
            const nameKey = product.label
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "_");

            const IconComponent = productIcons[nameKey] || Calendar;

            const description =
              environmentDescriptions[nameKey] ||
              "Accede a las fuentes de información disponibles para este dominio.";

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onProductClick(product.id)}
                className="
                  group

                  w-full
                  min-w-0
                  min-h-[180px]

                  bg-[--color-background]
                  border
                  border-transparent

                  p-5
                  md:p-6

                  rounded-2xl

                  text-left

                  flex
                  flex-col

                  cursor-pointer

                  hover:bg-white
                  hover:border-[--color-accent]
                  hover:shadow-sm
                  hover:-translate-y-0.5

                  transition-all
                  duration-200
                "
              >
                {/* Icon + título */}
                <div className="flex items-start gap-4">
                  <div
                    className="
                      w-11
                      h-11
                      md:w-12
                      md:h-12

                      rounded-xl

                      bg-[--color-accent-light]

                      flex
                      items-center
                      justify-center

                      flex-shrink-0
                    "
                  >
                    <IconComponent
                      className="
                        w-6
                        h-6
                        text-[--color-accent]
                      "
                    />
                  </div>

                  <h3
                    className="
                      pt-1
                      text-lg
                      md:text-xl
                      font-bold
                      text-[--color-text-primary]
                      group-hover:text-[--color-accent]
                      transition-colors
                    "
                  >
                    {product.label}
                  </h3>
                </div>

                {/* Descripción */}
                <p
                  className="
                    mt-4
                    text-sm
                    md:text-base
                    leading-relaxed
                    text-[--color-text-secondary]
                  "
                >
                  {description}
                </p>

                {/* CTA */}
                <div
                  className="
                    mt-auto
                    pt-5
                    text-sm
                    font-semibold
                    text-[--color-accent]
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                  "
                >
                  Acceder al dominio →
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
