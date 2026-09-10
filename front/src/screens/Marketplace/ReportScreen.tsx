import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Folder } from "components/Global/Icons/folder.svg";
import { ReactComponent as Kpi } from "components/Global/Icons/kpi.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";
import { ReactComponent as Eye } from "components/Global/Icons/eye.svg";
import { domainUnits } from "data/domain-units";
import { ReportModel } from "models/Global/reportsModel";
import Agent from "components/Agent/Agent";
import { LinksModel } from "models/Global/linksModel";

interface ReportScreenProps {
  reports: ReportModel[];
  links: LinksModel | undefined;
  isLoading: boolean;
  hasError: boolean;
}

const ReportScreen = ({
  reports,
  links,
  isLoading,
  hasError,
}: ReportScreenProps) => {
  const navigate = useNavigate();

  const { domainId, reportId } = useParams<{
    domainId: string;
    reportId: string;
  }>();

  const report = useMemo(
    () =>
      reports.find((item) => item.id === reportId && item.area === domainId),
    [reports, reportId, domainId],
  );

  const domain = domainUnits.find((unit) => unit.id === domainId);

  if (isLoading) {
    return (
      <main className="w-full min-h-full bg-[--color-background] p-10">
        <div className="w-full p-10 text-center bg-white rounded-2xl border border-[--color-border] text-[--color-text-secondary]">
          Cargando reporte...
        </div>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="w-full min-h-full bg-[--color-background] p-10">
        <div className="w-full p-10 text-center bg-white rounded-2xl border border-[--color-border] text-[--color-text-secondary]">
          No fue posible cargar el reporte.
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="w-full min-h-full bg-[--color-background] p-10">
        <div className="w-full p-10 text-center bg-white rounded-2xl border border-[--color-border] text-[--color-text-secondary]">
          Reporte no encontrado
        </div>
      </main>
    );
  }

  const iframeSrc = report.iframe?.match(/src=["']([^"']+)["']/i)?.[1];
  const requestAccessUrl = links?.enlaceAccesoReporte?.trim();

  return (
    <main className="w-full min-h-full bg-[--color-background] text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* HEADER */}
        <section className="w-full flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[--color-text-primary] break-words">
              {report.nombre}
            </h1>

            {/* BREADCRUMB */}
            <div className="mt-3 flex items-center gap-2 text-sm md:text-base text-[--color-text-secondary] min-w-0">
              <Folder className="w-5 h-5 flex-shrink-0" />

              <button
                type="button"
                onClick={() => navigate(`/marketplace/${domainId}`)}
                className="hover:text-[--color-accent] transition-colors truncate"
              >
                {domain?.name}
              </button>

              <span>/</span>

              <span className="truncate font-medium">{report.nombre}</span>
            </div>

            <p className="mt-4 text-sm md:text-base lg:text-lg leading-relaxed text-[--color-text-secondary] max-w-4xl">
              {report.descripcion}
            </p>
          </div>

          {/* ACCIONES */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (iframeSrc) {
                  window.open(iframeSrc, "_blank", "noopener,noreferrer");
                }
              }}
              disabled={!iframeSrc}
              className="
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
                gap-3
                px-5
                py-2.5
                rounded-[10px]
                bg-[--color-accent]
                text-white
                font-semibold
                text-sm
                md:text-base
                hover:opacity-90
                transition-opacity
                whitespace-nowrap
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <Export className="w-5 h-5 flex-shrink-0" />
              Abrir en Power BI
            </button>

            <button
              type="button"
              onClick={() => {
                if (requestAccessUrl) {
                  window.open(
                    requestAccessUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }
              }}
              disabled={!requestAccessUrl}
              className="
    w-full
    sm:w-auto

    flex
    items-center
    justify-center

    gap-3

    px-5
    py-2.5

    rounded-[10px]

    border
    border-[--color-border]

    bg-white

    text-[--color-text-secondary]

    font-semibold

    text-sm
    md:text-base

    hover:bg-[--color-accent-light]
    hover:text-[--color-accent]

    transition-colors

    whitespace-nowrap

    disabled:opacity-50
    disabled:cursor-not-allowed
  "
            >
              <Eye className="w-5 h-5 flex-shrink-0" />
              Solicitar acceso
            </button>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <section className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px] gap-6 md:gap-8 mt-8 md:mt-10">
          {/* PREVIEW */}
          <div className="w-full min-w-0 bg-white border border-[--color-border] rounded-2xl overflow-hidden">
            {iframeSrc ? (
              <iframe
                title={report.nombre}
                src={iframeSrc}
                className="w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[600px] 2xl:h-[700px]"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[600px] 2xl:h-[700px] flex items-center justify-center px-5 text-center text-sm md:text-base text-[--color-text-secondary]">
                Sin vista previa disponible
              </div>
            )}
          </div>

          {/* KPIS */}
          <aside className="w-full bg-white border border-[--color-border] rounded-2xl p-5 md:p-6 h-fit">
            <h2 className="text-xl md:text-2xl font-bold text-[--color-accent]">
              KPIs principales
            </h2>

            <div className="w-full border-t border-[--color-accent-light] mt-4" />

            <div className="mt-5 md:mt-6">
              {report.kpis.length === 0 ? (
                <p className="text-sm md:text-base text-[--color-text-secondary]">
                  No existen KPIs asociados
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 md:gap-4">
                  {report.kpis.map((kpi) => (
                    <div
                      key={kpi}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[--color-background] text-[--color-text-secondary]"
                    >
                      <Kpi className="w-5 h-5 flex-shrink-0 text-[--color-accent]" />

                      <span className="text-sm md:text-base">{kpi}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>

        {/* INFORMACIÓN ADICIONAL */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-6 md:mt-8">
          <div className="bg-white border border-[--color-border] rounded-2xl p-5 md:p-6">
            <p className="uppercase text-xs md:text-sm font-bold text-[--color-text-secondary]">
              Gerencia
            </p>

            <h3 className="mt-3 md:mt-4 text-base md:text-lg font-semibold text-[--color-text-primary]">
              {domain?.name ?? "No especificada"}
            </h3>
          </div>

          <div className="bg-white border border-[--color-border] rounded-2xl p-5 md:p-6">
            <p className="uppercase text-xs md:text-sm font-bold text-[--color-text-secondary]">
              Data Product Owner
            </p>

            <h3 className="mt-3 md:mt-4 text-base md:text-lg font-semibold text-[--color-text-primary]">
              No especificado
            </h3>
          </div>
        </section>
      </div>
      <Agent />
    </main>
  );
};

export default ReportScreen;
