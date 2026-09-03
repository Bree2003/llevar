import Skeleton from "react-loading-skeleton";

const BucketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="
      h-8
      w-8
      text-[--color-accent]
    "
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
    className="
      h-8
      w-8
      text-[--color-accent]
    "
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
  fi: "Contabilidad financiera, reportes legales, balances.",

  co: "Control de gestión, centros de costo, rentabilidad.",

  mm: "Compras, inventarios, gestión de materiales.",

  sd: "Ventas, facturación, distribución a clientes.",

  pp: "Planificación y control de la producción.",

  qm: "Aseguramiento de la calidad en procesos/productos.",

  pm: "Mantenimiento de equipos e instalaciones.",

  hr: "Gestión de personal, nómina, talento (HCM).",

  wm: "Gestión avanzada de bodegas.",

  ewm: "Gestión avanzada de bodegas (Extended).",

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
      sm:w-[290px]

      h-48

      bg-[--color-background]

      border
      border-[--color-border]

      p-5

      rounded-xl

      flex
      flex-col
      justify-between
    "
  >
    <div>
      <div
        className="
          flex
          items-center
          gap-5

          mb-2

          h-16
        "
      >
        <Skeleton circle width={32} height={32} />

        <div className="flex-grow">
          <Skeleton height={28} width="80%" />
        </div>
      </div>

      <Skeleton count={2} />
    </div>

    <Skeleton width={100} />
  </div>
);

export default function ProductCardGrid({
  title,
  items,
  loading,
  onItemClick,
}: ProductCardGridProps) {
  /*
   * Helper para obtener información de un módulo SAP.
   *
   * Formato esperado:
   * raw-dev-ddo-[CODIGO]-bucket
   */
  const getModuleInfo = (bucketName: string) => {
    const parts = bucketName.split("-");

    const code = parts.length > 3 ? parts[3] : "unknown";

    const configDescription = SAP_MODULES_CONFIG[code.toLowerCase()];

    /*
     * Título visible
     */
    let label = bucketName;

    if (code && code.length <= 3) {
      label = `Módulo ${code.toUpperCase()}`;
    } else {
      label = bucketName.replace(/-/g, " ");
    }

    /*
     * Descripción
     */
    const description =
      configDescription || "Almacenamiento de datos crudos (Raw Zone).";

    return {
      label,
      description,
    };
  };

  return (
    <div
      className="
        w-full

        text-left

        p-4
        md:p-6
        lg:p-10
      "
    >
      {/* Título */}
      <h1
        className="
          text-3xl

          font-bold

          text-[--color-accent]

          mb-8
          md:mb-10
        "
      >
        {loading ? <Skeleton width={400} /> : title}
      </h1>

      {/* Cards */}
      <div
        className="
          flex
          flex-wrap

          gap-5
        "
      >
        {loading ? (
          Array.from({
            length: 6,
          }).map((_, index) => <ProductCardSkeleton key={index} />)
        ) : items.length > 0 ? (
          items.map((item) => {
            let name = "";
            let label = "";
            let description = "";

            let IconComponent = BucketIcon;

            if (typeof item === "string") {
              name = item;

              const info = getModuleInfo(name);

              label = info.label;

              description = info.description;

              IconComponent = BucketIcon;
            } else {
              name = item.name;

              label = item.label || item.name;

              description = item.description || "Descripción no disponible.";

              IconComponent =
                item.icon === "product" ? ProductIcon : BucketIcon;
            }

            return (
              <div
                key={name}
                onClick={() => onItemClick(name)}
                className="
                  group

                  w-full
                  sm:w-[290px]

                  h-48

                  bg-[--color-background]

                  border
                  border-[--color-border]

                  p-5

                  rounded-xl

                  cursor-pointer

                  flex
                  flex-col
                  justify-between

                  bg-white
                  hover:border-[--color-accent]
                  hover:shadow-sm

                  transition-all
                  duration-200
                "
              >
                <div>
                  {/* Icono + título */}
                  <div
                    className="
                      flex
                      items-center
                      gap-4

                      mb-3

                      h-14
                    "
                  >
                    <div
                      className="
                        p-2

                        bg-white

                        border
                        border-[--color-border]

                        rounded-lg

                        group-hover:bg-[--color-accent-light]

                        transition-colors
                      "
                    >
                      <IconComponent />
                    </div>

                    <h2
                      className="
                        text-xl
                        font-bold

                        leading-tight

                        text-[--color-text-primary]

                        group-hover:text-[--color-accent]

                        transition-colors
                      "
                    >
                      {label}
                    </h2>
                  </div>

                  {/* Descripción */}
                  <p
                    className="
                      text-sm

                      text-[--color-text-secondary]

                      line-clamp-3

                      leading-relaxed
                    "
                  >
                    {description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="
              w-full

              py-12
              px-5

              text-center

              bg-[--color-background]

              rounded-xl

              border
              border-dashed
              border-[--color-border]
            "
          >
            <p
              className="
                text-[--color-text-secondary]
              "
            >
              No se encontraron módulos disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
