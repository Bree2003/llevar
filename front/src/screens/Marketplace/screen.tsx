import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as PresentationChart } from "components/Global/Icons/presention-chart.svg";
import { domainUnits } from "data/domain-units";

import { Report } from "./Admin/types";

const STORAGE_KEY = "admin_reports";

const getDomainUnitByArea = (area: string) => {
  return domainUnits.find((unit) => unit.id === area || unit.name === area);
};

const MarketplaceScreen = () => {
  const navigate = useNavigate();

  const reports: Report[] = JSON.parse(
    sessionStorage.getItem(STORAGE_KEY) || "[]",
  );

  const businessUnits = useMemo(() => {
    const groupedReports = reports.reduce(
      (acc, report) => {
        if (!report.area) {
          return acc;
        }

        const domainUnit = getDomainUnitByArea(report.area);

        if (!domainUnit) {
          return acc;
        }

        acc[domainUnit.id] = (acc[domainUnit.id] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(groupedReports)
      .map(([domainUnitId, reportsCount]) => {
        const domainUnit = domainUnits.find((unit) => unit.id === domainUnitId);

        if (!domainUnit) {
          return null;
        }

        return {
          id: domainUnit.id,
          name: domainUnit.name,
          description: domainUnit.description,
          reportsCount,
        };
      })
      .filter(
        (
          unit,
        ): unit is {
          id: string;
          name: string;
          description: string;
          reportsCount: number;
        } => unit !== null,
      );
  }, [reports]);

  return (
    <main className="flex flex-col items-start w-full min-h-full bg-gray-50 text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <section className="w-full">
          <h1
            className="
            text-3xl
            md:text-4xl
            xl:text-5xl
            font-bold
            text-[--color-accent]
          "
          >
            Marketplace
          </h1>

          <p
            className="
            mt-4
            md:mt-6
            text-base
            md:text-lg
            font-medium
            max-w-4xl
            text-[--color-text-secondary]
          "
          >
            Explora y accede a los diferentes reportes de los Productos de Datos
            certificados de Viña Concha y Toro para una toma de decisiones
            informada.
          </p>
        </section>

        {/* Contenido */}
        <section className="w-full mt-8 md:mt-10">
          {businessUnits.length === 0 ? (
            /* Estado vacío */
            <div
              className="
              w-full
              p-6
              sm:p-8
              md:p-10
              lg:p-12
              text-center
              bg-white
              rounded-2xl
              border
              border-[--color-border]
            "
            >
              <h3 className="text-lg md:text-xl font-semibold text-[--color-text-primary]">
                No existen unidades de negocio registradas
              </h3>

              <p
                className="
                text-sm
                md:text-base
                text-[--color-text-secondary]
                mt-2
                max-w-xl
                mx-auto
              "
              >
                Agrega al menos un reporte desde la pantalla de Administración
                para comenzar.
              </p>
            </div>
          ) : (
            /* Unidades de negocio */
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
              {businessUnits.map((unit) => (
                <button
                  type="button"
                  key={unit.id}
                  onClick={() => navigate(`/marketplace/${unit.id}`)}
                  className="
                  w-full
                  min-w-0
                  bg-[var(--color-white)]
                  p-5
                  md:p-6
                  rounded-2xl
                  text-left
                  border
                  border-[var(--color-border)]
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
                      <div
                        className="
                        bg-[--color-background]
                        p-2
                        md:p-2.5
                        rounded-[10px]
                        w-fit
                        flex-shrink-0
                      "
                      >
                        <PresentationChart
                          className="
                          w-7
                          h-7
                          md:w-8
                          md:h-8
                          text-[var(--color-accent)]
                        "
                        />
                      </div>

                      <div
                        className="
                        uppercase
                        h-fit
                        px-2.5
                        py-2
                        rounded-md
                        font-medium
                        bg-[--color-background]
                        text-[10px]
                        sm:text-xs
                        text-[--color-text-secondary]
                        text-right
                        whitespace-nowrap
                      "
                      >
                        Unidad de negocio
                      </div>
                    </div>

                    {/* Título */}
                    <h3
                      className="
                      mt-4
                      text-lg
                      md:text-xl
                      xl:text-2xl
                      font-bold
                      text-[var(--color-text-primary)]
                      break-words
                    "
                    >
                      {unit.name}
                    </h3>

                    {/* Descripción */}
                    <p
                      className="
                      mt-3
                      text-sm
                      md:text-base
                      leading-relaxed
                      text-[var(--color-text-secondary)]
                    "
                    >
                      {unit.description}
                    </p>
                  </div>

                  {/* Cantidad de reportes */}
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
                    <span className="text-xs md:text-sm text-[--color-text-secondary]">
                      {unit.reportsCount === 1
                        ? "1 reporte disponible"
                        : `${unit.reportsCount} reportes disponibles`}
                    </span>

                    <span className="text-[--color-accent] font-semibold text-sm">
                      Ver reportes →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default MarketplaceScreen;
