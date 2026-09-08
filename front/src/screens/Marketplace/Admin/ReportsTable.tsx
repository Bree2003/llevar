import { ReactComponent as Edit } from "components/Global/Icons/edit.svg";
import { ReactComponent as Trash } from "components/Global/Icons/trash.svg";
import { ReactComponent as Kpi } from "components/Global/Icons/kpi.svg";

import { domainUnits } from "data/domain-units";

import { ReportModel } from "models/Global/reportsModel";

interface ReportsTableProps {
  reports: ReportModel[];

  onEdit: (report: ReportModel) => void;

  onDelete: (id: string) => void;
}

const getDomainUnitName = (area: string) => {
  const domainUnit = domainUnits.find(
    (unit) => unit.id === area || unit.name === area,
  );

  return domainUnit?.name ?? area;
};

const ReportsTable = ({ reports, onEdit, onDelete }: ReportsTableProps) => {
  return (
    <div
      className="
        w-full

        bg-white

        rounded-[20px]

        border
        border-[--color-border]

        overflow-hidden
      "
    >
      <table
        className="
          w-full

          min-w-[900px]
        "
      >
        <thead
          className="
            bg-[--color-background]

            text-[--color-text-muted]
          "
        >
          <tr>
            <th
              className="
                px-6
                py-4

                text-left

                text-xs
                uppercase
              "
            >
              Reporte
            </th>

            <th
              className="
                px-6
                py-4

                text-left

                text-xs
                uppercase
              "
            >
              Área
            </th>

            <th
              className="
                px-6
                py-4

                text-left

                text-xs
                uppercase
              "
            >
              KPIs
            </th>

            <th
              className="
                px-6
                py-4

                text-left

                text-xs
                uppercase
              "
            >
              Última Modificación
            </th>

            <th
              className="
                px-6
                py-4

                text-right

                text-xs
                uppercase
              "
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody
          className="
            divide-y
            divide-[--color-border]
          "
        >
          {reports.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="
                  py-12

                  text-center

                  text-sm

                  text-[--color-text-secondary]
                "
              >
                No existen reportes.
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr
                key={report.id}
                className="
                    hover:bg-[--color-background]

                    transition-colors
                  "
              >
                {/* REPORTE */}
                <td
                  className="
                      px-6
                      py-4

                      max-w-[420px]
                    "
                >
                  <p
                    className="
                        font-semibold

                        text-[--color-text-primary]
                      "
                  >
                    {report.nombre}
                  </p>

                  <p
                    className="
                        mt-1

                        text-sm

                        text-[--color-text-muted]

                        leading-relaxed
                      "
                  >
                    {report.descripcion}
                  </p>
                </td>

                {/* AREA */}
                <td className="px-6 py-4">
                  <span
                    className="
                        inline-flex

                        py-[6px]
                        px-[10px]

                        bg-[--color-background]

                        rounded-md

                        text-xs
                        font-medium

                        text-[--color-text-secondary]
                      "
                  >
                    {getDomainUnitName(report.area)}
                  </span>
                </td>

                {/* KPIS */}
                <td className="px-6 py-4">
                  {report.kpis?.length > 0 ? (
                    <div
                      className="
                          flex
                          flex-wrap

                          items-center

                          gap-1
                        "
                    >
                      {report.kpis.map((kpi, index) => (
                        <span
                          key={`${report.id}-${kpi}-${index}`}
                          title={kpi}
                          className="
                                flex
                                items-center
                                justify-center
                              "
                        >
                          <Kpi />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span
                      className="
                          text-[--color-text-muted]
                        "
                    >
                      -
                    </span>
                  )}
                </td>

                {/* FECHA */}
                <td
                  className="
                      px-6
                      py-4

                      whitespace-nowrap

                      text-[--color-text-secondary]
                    "
                >
                  {report.fechaModificacion || "-"}
                </td>

                {/* ACCIONES */}
                <td
                  className="
                      px-6
                      py-4

                      text-right
                    "
                >
                  <div
                    className="
                        flex
                        justify-end

                        gap-2
                      "
                  >
                    <button
                      type="button"
                      onClick={() => onEdit(report)}
                      className="
                          py-[6px]
                          px-[10px]

                          flex
                          items-center
                          gap-1

                          rounded-md

                          bg-[--color-background]

                          text-sm
                          font-medium

                          text-[--color-text-secondary]

                          hover:bg-[--color-accent-light]
                          hover:text-[--color-accent]

                          transition-colors
                        "
                    >
                      <Edit />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(report.id)}
                      className="
                          py-[6px]
                          px-[10px]

                          flex
                          items-center
                          gap-1

                          rounded-md

                          bg-[--color-error]

                          text-sm
                          font-medium

                          text-white

                          hover:opacity-90

                          transition-opacity
                        "
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
