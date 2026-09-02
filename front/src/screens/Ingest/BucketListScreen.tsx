import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BucketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    />
  </svg>
);

const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const SAP_MODULES_CONFIG: Record<string, string> = {
  fi: "Contabilidad financiera, reportes legales y balances.",
  co: "Control de gestión, centros de costo y rentabilidad.",
  mm: "Compras, inventarios y gestión de materiales.",
  sd: "Ventas, facturación y distribución a clientes.",
  pp: "Planificación y control de la producción.",
  qm: "Aseguramiento de la calidad en procesos y productos.",
  pm: "Mantenimiento de equipos e instalaciones.",
  hr: "Gestión de personal, nómina y talento.",
  wm: "Gestión avanzada de bodegas.",
  ewm: "Gestión avanzada de bodegas.",
  tm: "Logística y transporte.",
  cs: "Servicios postventa.",
  ps: "Agricultura.",
  le: "Ejecución logística y envíos.",
  bc: "Módulo base y conectividad.",
};

type GridItem =
  | string
  | {
      name: string;
      label?: string;
      description?: string;
      icon?: "product" | "bucket";
    };

interface ProductCardGridProps {
  title: string;
  items: GridItem[];
  loading?: boolean;
  onItemClick: (itemName: string) => void;
}

const ProductCardSkeleton = () => (
  <div
    className="
      w-full
      min-h-[210px]
      bg-white
      border
      border-[--color-border]
      rounded-2xl
      p-5
      md:p-6
    "
  >
    <div className="flex items-start justify-between gap-4">
      <Skeleton width={48} height={48} borderRadius={12} />

      <Skeleton width={80} height={26} borderRadius={8} />
    </div>

    <div className="mt-5">
      <Skeleton height={24} width="65%" />

      <div className="mt-3">
        <Skeleton count={2} />
      </div>
    </div>
  </div>
);

export default function ProductCardGrid({
  title,
  items,
  loading,
  onItemClick,
}: ProductCardGridProps) {
  const getModuleInfo = (bucketName: string) => {
    const parts = bucketName.split("-");

    const code = parts.length > 3 ? parts[3] : "unknown";

    const configDescription = SAP_MODULES_CONFIG[code.toLowerCase()];

    let label = bucketName;

    if (code && code !== "unknown" && code.length <= 3) {
      label = `Módulo ${code.toUpperCase()}`;
    } else {
      label = bucketName.replace(/-/g, " ");
    }

    const description =
      configDescription ||
      "Fuente de almacenamiento de información disponible dentro de este dominio.";

    return {
      label,
      description,
      code,
    };
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
            {loading ? <Skeleton width={220} /> : title}
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
              Selecciona un módulo para explorar sus fuentes de información.
            </p>
          )}
        </div>

        {!loading && items.length > 0 && (
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
            {items.length === 1
              ? "1 módulo disponible"
              : `${items.length} módulos disponibles`}
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
        ) : items.length > 0 ? (
          items.map((item) => {
            let name = "";
            let label = "";
            let description = "";
            let code = "";
            let IconComponent = BucketIcon;

            if (typeof item === "string") {
              name = item;

              const info = getModuleInfo(name);

              label = info.label;
              description = info.description;
              code = info.code;

              IconComponent = BucketIcon;
            } else {
              name = item.name;

              label = item.label || item.name;

              description =
                item.description ||
                "Fuente de información disponible dentro de este dominio.";

              IconComponent =
                item.icon === "product" ? ProductIcon : BucketIcon;
            }

            return (
              <button
                type="button"
                key={name}
                onClick={() => onItemClick(name)}
                className="
                  group

                  w-full
                  min-w-0
                  min-h-[220px]

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

                  cursor-pointer
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
                      <IconComponent />
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
                      {code && code !== "unknown"
                        ? `SAP ${code.toUpperCase()}`
                        : "Fuente de datos"}
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

                      break-words

                      group-hover:text-[--color-accent]

                      transition-colors
                    "
                  >
                    {label}
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
                    {description}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="
                    mt-6
                    pt-4

                    border-t
                    border-[--color-border]

                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <span
                    className="
                      text-xs
                      md:text-sm

                      text-[--color-text-secondary]
                    "
                  >
                    Explorar fuente
                  </span>

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-[--color-accent]
                    "
                  >
                    Acceder →
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          /* Vacío */
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
              No se encontraron módulos disponibles
            </h3>

            <p
              className="
                mt-2
                text-sm
                md:text-base
                text-[--color-text-secondary]
              "
            >
              Este dominio todavía no tiene fuentes configuradas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
