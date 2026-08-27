import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ReactComponent as BarChart } from "components/Global/Icons/bar-chart.svg";
import { ReactComponent as Download } from "components/Global/Icons/download.svg";
import { ReactComponent as ArrowRight } from "components/Global/Icons/arrow-right.svg";

import { domainUnits } from "data/domain-units";

import { Report } from "./Admin/types";

const STORAGE_KEY = "admin_reports";

interface DomainScreenProps {
  onDownloadExcel: (productName: string) => void;
}

const DomainScreen = ({ onDownloadExcel }: DomainScreenProps) => {
  const navigate = useNavigate();

  const { domainId } = useParams<{
    domainId: string;
  }>();

  const reports: Report[] = JSON.parse(
    sessionStorage.getItem(STORAGE_KEY) || "[]",
  );

  const selectedDomain = domainUnits.find((unit) => unit.id === domainId);

  const domainReports = useMemo(() => {
    return reports.filter((report) => report.area === domainId);
  }, [reports, domainId]);

  const handleOpenReport = (report: Report) => {
    navigate(`/marketplace/${domainId}/${report.id}`);
  };

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
            {selectedDomain?.name ?? "Unidad de Negocio"}
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
            {selectedDomain?.description ??
              "Explora los productos de datos y reportes disponibles para esta unidad de negocio."}
          </p>
        </section>

        {/* Contenido */}
        <section className="w-full mt-8 md:mt-10">
          {domainReports.length === 0 ? (
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
                No existen reportes registrados
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
                Esta unidad de negocio aún no tiene productos de datos
                configurados.
              </p>
            </div>
          ) : (
            /* Reportes */
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
              {domainReports.map((report) => (
                <div
                  key={report.id}
                  className="
                  w-full
                  min-w-0
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
                  {/* Información */}
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
                        <BarChart
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
                        whitespace-nowrap
                      "
                      >
                        Power BI
                      </div>
                    </div>

                    {/* Nombre */}
                    <h3
                      className="
                      mt-4
                      text-lg
                      md:text-xl
                      font-bold
                      text-[var(--color-text-primary)]
                      break-words
                    "
                    >
                      {report.nombre}
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
                      {report.descripcion}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div
                    className="
                    mt-6
                    pt-4
                    border-t
                    border-[--color-border]
                    flex
                    flex-col
                    gap-3
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                  "
                  >
                    {/* Descargar */}
                    <button
                      type="button"
                      onClick={() => onDownloadExcel(report.dataset)}
                      className="
                      w-full
                      xl:w-auto
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-2
                      px-3
                      rounded-[10px]
                      border
                      border-[--color-border]
                      text-[--color-text-secondary]
                      font-medium
                      text-sm
                      hover:bg-[--color-background]
                      transition-colors
                      whitespace-nowrap
                    "
                    >
                      <Download className="w-5 h-5 flex-shrink-0" />
                      Descargar Excel
                    </button>

                    {/* Ver reporte */}
                    <button
                      type="button"
                      onClick={() => handleOpenReport(report)}
                      className="
                      w-full
                      xl:w-auto
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-2
                      px-3
                      rounded-lg
                      text-[--color-accent]
                      font-medium
                      uppercase
                      text-sm
                      hover:bg-[--color-accent-light]
                      transition-colors
                      whitespace-nowrap
                    "
                    >
                      Ver Reporte
                      <ArrowRight className="w-4 h-4 -rotate-90 flex-shrink-0" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default DomainScreen;
