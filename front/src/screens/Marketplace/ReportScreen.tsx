import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Folder } from "components/Global/Icons/folder.svg";
import { ReactComponent as Kpi } from "components/Global/Icons/kpi.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";
import { ReactComponent as Eye } from "components/Global/Icons/eye.svg";

import { domainUnits } from "data/domain-units";

import { Report } from "./Admin/types";

const STORAGE_KEY = "admin_reports";

const ReportScreen = () => {
    const navigate = useNavigate();

    const { domainId, reportId } = useParams();

    const reports: Report[] = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "[]"
    );

    const report = useMemo(
        () =>
            reports.find(
                (item) =>
                    item.id === reportId &&
                    item.area === domainId
            ),
        [reports, reportId, domainId]
    );

    const domain = domainUnits.find(
        (unit) => unit.id === domainId
    );

    if (!report) {
        return (
            <div className="p-10">
                Reporte no encontrado
            </div>
        );
    }

    const iframeSrc = report.iframe?.match(
        /src=["']([^"']+)["']/
    )?.[1];

    return (
        <main className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex text-left justify-between items-start">

                    <div>

                        <h1 className="text-4xl font-bold text-[--color-text-primary]">
                            {report.nombre}
                        </h1>

                        <span className="mt-2 flex gap-2 text-[--color-text-secondary]">
                            <Folder />
                            {domain?.name} / {report.nombre}
                        </span>

                        <p className="mt-4 text-[--color-text-secondary]">
                            {report.descripcion}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">

                        <button
                            type="button"
                            onClick={() => {
                                if (iframeSrc) {
                                    window.open(
                                        iframeSrc,
                                        "_blank",
                                        "noopener,noreferrer"
                                    );
                                }
                            }}
                            className="
                                px-[20px]
                                py-[10px]
                                gap-3
                                items-center
                                rounded-[10px]
                                bg-[--color-accent]
                                text-white
                                font-semibold
                                flex
                            "
                        >
                            <Export />
                            Abrir en Power BI
                        </button>

                        <button
                            type="button"
                            className="
                                px-[20px]
                                py-[10px]
                                gap-3
                                items-center
                                rounded-[10px]
                                border
                                border-[--color-border]
                                bg-white
                                text-[--color-text-secondary]
                                font-semibold
                                flex
                            "
                        >
                            <Eye />
                            Solicitar acceso
                        </button>

                    </div>

                </div>

                {/* CONTENIDO */}
                <div className="grid grid-cols-[1fr_320px] gap-8 mt-10">

                    {/* PREVIEW */}
                    <div
                        className="
        bg-white
        border
        border-[--color-border]
        rounded-2xl
        overflow-hidden
        min-h-[500px]
    "
                    >
                        {iframeSrc ? (
                            <iframe
                                title={report.nombre}
                                src={iframeSrc}
                                className="w-full h-[500px]"
                                allowFullScreen
                            />
                        ) : (
                            <div
                                className="
                h-[700px]
                flex
                items-center
                justify-center
                text-[--color-text-secondary]
            "
                            >
                                Sin vista previa disponible
                            </div>
                        )}
                    </div>

                    {/* KPIS */}
                    <aside
                        className="
            bg-white
            border
            border-[--color-border]
            rounded-2xl
            p-6
            flex
            flex-col
            gap-4
            h-fit
        "
                    >
                        <h2 className="text-2xl font-bold text-[--color-accent]">
                            KPIs principales
                        </h2>

                        <hr className="border-2 border-[--color-accent-light]" />

                        <div className="mt-6 space-y-4">

                            {report.kpis.length === 0 ? (
                                <p className="text-[--color-text-secondary]">
                                    No existen KPIs asociados
                                </p>
                            ) : (
                                report.kpis.map((kpi) => (
                                    <div
                                        key={kpi}
                                        className="
                            flex
                            items-center
                            gap-3
                            text-[--color-text-secondary]
                        "
                                    >
                                        <Kpi />

                                        <span>
                                            {kpi}
                                        </span>
                                    </div>
                                ))
                            )}

                        </div>

                    </aside>

                </div>

                {/* FOOTER */}
                <div className="grid text-left grid-cols-3 gap-6 mt-8">

                    <div
                        className="
                            bg-white
                            border
                            border-[--color-border]
                            rounded-2xl
                            p-6
                        "
                    >
                        <p className="uppercase text-sm font-bold text-[--color-text-secondary]">
                            Gerencia
                        </p>

                        <h3 className="mt-4 font-semibold text-[--color-text-primary]">
                            {domain?.name}
                        </h3>
                    </div>

                    <div
                        className="
                            bg-white
                            border
                            border-[--color-border]
                            rounded-2xl
                            p-6
                        "
                    >
                        <p className="uppercase text-sm font-bold text-[--color-text-secondary]">
                            Data Product Owner
                        </p>

                        <h3 className="mt-4 font-semibold text-[--color-text-primary]">
                            No especificado
                        </h3>
                    </div>

                </div>

            </div>
        </main>
    );
};

export default ReportScreen;