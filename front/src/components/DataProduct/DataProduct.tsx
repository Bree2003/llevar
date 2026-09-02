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
  dominio_de_origen: "Fuentes transversales a más de un producto de datos.",

  dominio_de_negocio: "Fuentes propias de cada producto de datos.",
};

const ProductCardSkeleton = () => (
  <div
    className="
      bg-[--color-background]
      border
      border-[--color-border]
      p-5
      rounded-xl
      w-[290px]
      h-40
    "
  >
    <div className="flex items-center gap-5 mb-2 h-16">
      <Skeleton circle width={32} height={32} />

      <div className="flex-grow">
        <Skeleton height={28} width="80%" />
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
    <div className="w-full text-left p-10">
      <h1
        className="
          text-3xl
          text-[--color-accent]
          font-bold
          mb-10
        "
      >
        {loading ? <Skeleton width={400} /> : "Principales dominios"}
      </h1>

      <div className="flex flex-wrap gap-5">
        {loading
          ? Array.from({
              length: 6,
            }).map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map((product) => {
              const nameKey = product.label
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "_");

              const IconComponent = productIcons[nameKey] || Calendar;

              const description =
                environmentDescriptions[nameKey] ||
                "Descripción no disponible.";

              return (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product.id)}
                  className="
                      group

                      bg-[--color-background]

                      border
                      border-[--color-border]

                      p-5

                      rounded-xl

                      w-[290px]
                      h-40

                      cursor-pointer

                      bg-white
                      hover:border-[--color-accent]
                      hover:shadow-sm

                      transition-all
                      duration-200
                    "
                >
                  <div
                    className="
                        flex
                        items-center
                        gap-5
                        mb-2
                        h-16
                      "
                  >
                    <IconComponent
                      className="
                          w-8
                          h-8

                          flex-shrink-0

                          text-[--color-accent]
                        "
                    />

                    <h2
                      className="
                          text-2xl
                          font-semibold

                          text-[--color-text-primary]

                          transition-colors

                          group-hover:text-[--color-accent]
                        "
                    >
                      {product.label}
                    </h2>
                  </div>

                  <p
                    className="
                        text-[--color-text-secondary]
                      "
                  >
                    {description}
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
}
