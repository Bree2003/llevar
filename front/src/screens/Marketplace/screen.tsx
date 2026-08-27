import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as PresentationChart } from "components/Global/Icons/presention-chart.svg";
import { domainUnits } from "data/domain-units";

import { Report } from "./Admin/types";

const STORAGE_KEY = "admin_reports";

const getDomainUnitByArea = (area: string) => {
    return domainUnits.find(
        (unit) => unit.id === area || unit.name === area
    );
};

const MarketplaceScreen = () => {
    const navigate = useNavigate();

    const reports: Report[] = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "[]"
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
            {} as Record<string, number>
        );

        return Object.entries(groupedReports)
            .map(([domainUnitId, reportsCount]) => {
                const domainUnit = domainUnits.find(
                    (unit) => unit.id === domainUnitId
                );

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
                    unit
                ): unit is {
                    id: string;
                    name: string;
                    description: string;
                    reportsCount: number;
                } => unit !== null
            );
    }, [reports]);

    return (
        <main className="flex flex-col items-start w-full h-full bg-gray-50 text-left p-8">
            <div className="max-w-5xl w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-[--color-accent]">
                    Marketplace
                </h1>

                <p className="mt-6 text-lg font-medium max-w-4xl text-[--color-text-secondary]">
                    Explora y accede a los diferentes reportes de los Productos de Datos certificados de Viña Concha y Toro para una toma de deciciones informada.
                </p>

                {businessUnits.length === 0 ? (
                    <div
                        className="
                            mt-10
                            p-12
                            text-center
                            bg-white
                            rounded-2xl
                            border
                            border-[--color-border]
                        "
                    >
                        <h3 className="text-lg font-semibold text-[--color-text-primary]">
                            No existen unidades de negocio registradas
                        </h3>

                        <p className="text-[--color-text-secondary] mt-2">
                            Agrega al menos un reporte desde la pantalla de
                            Administración para comenzar.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                        {businessUnits.map((unit) => (
                            <button
                                type="button"
                                key={unit.id}
                                onClick={() =>
                                    navigate(`/marketplace/${unit.id}`)
                                }
                                className="
                                    bg-[var(--color-white)]
                                    p-6
                                    rounded-2xl
                                    text-left
                                    border
                                    border-[var(--color-border)]
                                    shadow-sm
                                    hover:shadow-md
                                    transition-all
                                    flex
                                    flex-col
                                    justify-between
                                    cursor-pointer
                                "
                            >
                                <div className="flex justify-between">
                                    <div className="bg-[--color-background] p-2 rounded-[10px] w-fit">
                                        <PresentationChart className="w-8 h-8 text-[var(--color-accent)]" />
                                    </div>

                                    <div
                                        className="
                                            uppercase
                                            h-fit
                                            p-[10px]
                                            rounded-md
                                            font-medium
                                            bg-[--color-background]
                                            text-xs
                                            text-[--color-text-secondary]
                                        "
                                    >
                                        Unidad de negocio
                                    </div>
                                </div>

                                <h3 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">
                                    {unit.name}
                                </h3>

                                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                                    {unit.description}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MarketplaceScreen;