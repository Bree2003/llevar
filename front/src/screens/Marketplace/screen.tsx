import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "store/hooks/redux-hooks";
import { checkDomain } from "modules/tokenPermission/utils/user-token.util";
import { ReactComponent as PresentationChart } from "components/Global/Icons/presention-chart.svg";
import { DomainModel } from "models/Global/domainsModel";
import { ReportModel } from "models/Global/reportsModel";

interface MarketplaceScreenProps {
  reports: ReportModel[];
  domains: DomainModel[];
  isLoading: boolean;
  hasError: boolean;
}

const getDomainUnitByArea = (dom: DomainModel[], area: string) => {
  return dom.find((unit) => unit.id === area || unit.name === area);
};

const MarketplaceScreen = ({
  reports,
  domains,
  isLoading,
  hasError,
}: MarketplaceScreenProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.UserPermissions);
  const userDomains = user.domains;

  const businessUnits = useMemo(() => {
    const groupedReports = reports.reduce(
      (acc, report) => {
        if (!report.area) {
          return acc;
        }

        const domainUnit = getDomainUnitByArea(domains, report.area);

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
        const domainUnit = domains.find((unit) => unit.id === domainUnitId);

        if (!domainUnit) {
          return null;
        }

        if(!checkDomain(userDomains, domainUnitId)) {
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
  }, [domains, reports]);

  return (
    <main className="flex flex-col items-start w-full min-h-full bg-[--color-background] text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* HEADER */}
        <section className="w-full">
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[--color-accent]">
            Marketplace
          </h1>

          <p className="mt-4 md:mt-6 text-base md:text-lg font-medium max-w-4xl text-[--color-text-secondary]">
            Explora y accede a los diferentes reportes de los Productos de Datos
            certificados de Viña Concha y Toro para una toma de decisiones
            informada.
          </p>
        </section>

        {/* CONTENIDO */}
        <section className="w-full mt-8 md:mt-10">
          {isLoading ? (
            <div className="w-full p-10 text-center bg-white rounded-2xl border border-[--color-border] text-[--color-text-secondary]">
              Cargando reportes...
            </div>
          ) : hasError ? (
            <div className="w-full p-10 text-center bg-white rounded-2xl border border-[--color-border]">
              <h3 className="text-lg font-semibold text-[--color-text-primary]">
                No fue posible cargar los reportes
              </h3>

              <p className="mt-2 text-sm text-[--color-text-secondary]">
                Intenta nuevamente más tarde.
              </p>
            </div>
          ) : businessUnits.length === 0 ? (
            <div className="w-full p-6 sm:p-8 md:p-10 lg:p-12 text-center bg-white rounded-2xl border border-[--color-border]">
              <h3 className="text-lg md:text-xl font-semibold text-[--color-text-primary]">
                No existen unidades de negocio registradas
              </h3>

              <p className="text-sm md:text-base text-[--color-text-secondary] mt-2 max-w-xl mx-auto">
                Agrega al menos un reporte desde la pantalla de Administración
                para comenzar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6 xl:gap-8 w-full">
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="bg-[--color-background] p-2 md:p-2.5 rounded-[10px] w-fit flex-shrink-0">
                        <PresentationChart className="w-7 h-7 md:w-8 md:h-8 text-[var(--color-accent)]" />
                      </div>

                      <div className="uppercase h-fit px-2.5 py-2 rounded-md font-medium bg-[--color-background] text-[10px] sm:text-xs text-[--color-text-secondary] text-right whitespace-nowrap">
                        Unidad de negocio
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg md:text-xl xl:text-2xl font-bold text-[var(--color-text-primary)] break-words">
                      {unit.name}
                    </h3>

                    <p className="mt-3 text-sm md:text-base leading-relaxed text-[var(--color-text-secondary)]">
                      {unit.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[--color-border] flex items-center justify-between gap-3">
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
