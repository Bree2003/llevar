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

const DomainScreen = ({
    onDownloadExcel,
}: DomainScreenProps) => {
    const navigate = useNavigate();

    const { domainId } = useParams<{
        domainId: string;
    }>();

    const reports: Report[] = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "[]"
    );

    const selectedDomain = domainUnits.find(
        (unit) => unit.id === domainId
    );

    const domainReports = useMemo(() => {
        return reports.filter(
            (report) => report.area === domainId
        );
    }, [reports, domainId]);

    const handleOpenReport = (report: Report) => {
        navigate(
            `/marketplace/${domainId}/${report.id}`
        );
    };

    return (
        <main className="flex flex-col items-start w-full h-full bg-gray-50 text-left p-8">
            <div className="max-w-6xl w-full">

                <h1 className="text-3xl md:text-4xl font-bold text-[--color-accent]">
                    {selectedDomain?.name ?? "Unidad de Negocio"}
                </h1>

                <p className="mt-6 text-lg font-medium max-w-4xl text-[--color-text-secondary]">
                    Esta unidad de negocio ofrece un portafolio de productos de datos enfocados en fortalecer y optimizar la gestión integral de la cadena de suministro.
                </p>

                {domainReports.length === 0 ? (
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
                            No existen reportes registrados
                        </h3>

                        <p className="text-[--color-text-secondary] mt-2">
                            Esta unidad de negocio aún no tiene productos de datos configurados.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                        {domainReports.map((report) => (
                            <div
                                key={report.id}
                                className="
                                    bg-white
                                    p-6
                                    rounded-2xl
                                    text-left
                                    border
                                    border-[--color-border]
                                    shadow-sm
                                    hover:shadow-md
                                    transition-all
                                    flex
                                    flex-col
                                    justify-between
                                "
                            >
                                <div>
                                    <div className="flex justify-between">
                                        <div className="bg-[--color-background] p-2 rounded-[10px] w-fit">
                                            <BarChart className="w-8 h-8 text-[var(--color-accent)]" />
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
                                            Power BI
                                        </div>
                                    </div>

                                    <h3 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">
                                        {report.nombre}
                                    </h3>

                                    <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                                        {report.descripcion}
                                    </p>
                                </div>

                                <div className="flex gap-2 mt-6 justify-between">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDownloadExcel(report.dataset)
                                        }
                                        className="
      flex
      py-[6px] px-[10px]
      items-center
      gap-2
      rounded-[10px]
      border
      border-[--color-border]
      text-[--color-text-secondary]
      font-medium
      text-sm
  "
                                    >
                                        <Download className="h-7" />
                                        Descargar Excel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleOpenReport(report)
                                        }
                                        className="
                                            flex
                                            py-[6px] px-[10px]
                                            items-center
                                            gap-2
                                            rounded-lg
                                            text-[--color-accent]
                                            font-medium
                                            uppercase
                                            text-sm
                                        "
                                    >
                                        Ver Reporte
                                        <ArrowRight className="-rotate-90" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default DomainScreen;