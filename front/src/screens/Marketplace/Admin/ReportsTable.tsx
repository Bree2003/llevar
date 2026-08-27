import { ReactComponent as Edit } from "components/Global/Icons/edit.svg";
import { ReactComponent as Trash } from "components/Global/Icons/trash.svg";
import { ReactComponent as Kpi } from "components/Global/Icons/kpi.svg";
import { domainUnits } from "data/domain-units";

import { Report } from "./types";

interface ReportsTableProps {
    reports: Report[];
    onEdit: (report: Report) => void;
    onDelete: (id: string) => void;
}

const getDomainUnitName = (area: string) => {
    const domainUnit = domainUnits.find(
        (unit) => unit.id === area || unit.name === area
    );

    return domainUnit?.name ?? area;
};

const ReportsTable = ({
    reports,
    onEdit,
    onDelete,
}: ReportsTableProps) => {
    return (
        <div className="mt-8 bg-white rounded-[20px] border border-[--color-border] overflow-hidden">
            <table className="w-full p-5 gap-5">
                <thead className="bg-[--color-background] text-[--color-text-muted]">
                    <tr>
                        <th className="px-6 py-4 text-left">Reporte</th>
                        <th className="px-6 py-4 text-left">Dataset</th>
                        <th className="px-6 py-4 text-left">Área</th>
                        <th className="px-6 py-4 text-left">KPIs</th>
                        <th className="px-6 py-4 text-left">
                            Última Modificación
                        </th>
                        <th className="px-6 py-4 text-left">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {reports.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-10 text-center text-[--color-text-secondary]"
                            >
                                No existen reportes.
                            </td>
                        </tr>
                    ) : (
                        reports.map((report) => (
                            <tr
                                key={report.id}
                                className="border-t border-gray-100"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-[--color-text-primary]">
                                            {report.nombre}
                                        </p>

                                        <p className="text-sm text-[--color-text-muted]">
                                            {report.descripcion}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-[--color-text-muted]">
                                    {report.dataset}
                                </td>

                                <td className="px-6 py-4 text-[--color-text-secondary] uppercase">
                                    <span className="py-[6px] px-[10px] bg-[--color-background] rounded text-xs">
                                        {getDomainUnitName(report.area)}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {report.kpis.length === 0 ? (
                                            <span className="text-[--color-text-muted]">
                                                -
                                            </span>
                                        ) : (
                                            report.kpis.map((kpi, index) => (
                                                <span
                                                    key={`${report.id}-${kpi}-${index}`}
                                                    className="-m-[6px]"
                                                    title={kpi}
                                                >
                                                    <Kpi />
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-[--color-text-secondary]">
                                    {report.fechaModificacion}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(report)}
                                            className="text-[--color-text-secondary] py-[6px] px-[10px] flex gap-1 items-center rounded-md bg-[--color-background]"
                                        >
                                            <Edit />
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(report.id)}
                                            className="text-white py-[6px] px-[10px] flex gap-1 items-center rounded-md bg-[--color-error]"
                                        >
                                            <Trash />
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsTable;