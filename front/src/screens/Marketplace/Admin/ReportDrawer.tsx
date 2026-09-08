import { useEffect, useState } from "react";

import { ReactComponent as Text } from "components/Global/Icons/text.svg";
import { ReactComponent as TextAlignLeft } from "components/Global/Icons/textalign-left.svg";
import { ReactComponent as Chart } from "components/Global/Icons/chart.svg";
import { ReactComponent as Close } from "components/Global/Icons/close.svg";

import { domainUnits } from "data/domain-units";

import { ReportModel } from "models/Global/reportsModel";

interface ReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: ReportModel) => void;
  report?: ReportModel | null;
}

const initialForm = {
  nombre: "",
  descripcion: "",
  area: "",
  iframe: "",
};

const getDomainUnitId = (area: string) => {
  const domainUnit = domainUnits.find(
    (unit) => unit.id === area || unit.name === area,
  );

  return domainUnit?.id ?? area;
};

const ReportDrawer = ({
  isOpen,
  onClose,
  onSave,
  report,
}: ReportDrawerProps) => {
  const NAVBAR_HEIGHT = 85.33;

  const [form, setForm] = useState(initialForm);

  const [kpiInput, setKpiInput] = useState("");

  const [kpis, setKpis] = useState<string[]>([]);

  useEffect(() => {
    if (report) {
      setForm({
        nombre: report.nombre,
        descripcion: report.descripcion,
        area: getDomainUnitId(report.area),
        iframe: report.iframe,
      });

      setKpis(report.kpis || []);
      setKpiInput("");
    } else {
      setForm(initialForm);
      setKpis([]);
      setKpiInput("");
    }
  }, [report, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddKpi = () => {
    const normalizedKpi = kpiInput.trim();

    if (!normalizedKpi) {
      return;
    }

    setKpis((prev) => [...prev, normalizedKpi]);

    setKpiInput("");
  };

  const handleRemoveKpi = (index: number) => {
    setKpis((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const resetForm = () => {
    setForm(initialForm);
    setKpiInput("");
    setKpis([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateReportId = (nombre: string) => {
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSave = () => {
    const nombre = form.nombre.trim();
    const descripcion = form.descripcion.trim();
    const iframe = form.iframe.trim();

    if (!nombre || !descripcion || !form.area || !iframe) {
      return;
    }

    const newReport: ReportModel = {
      id: report?.id ?? generateReportId(nombre),

      nombre,
      descripcion,
      area: form.area,
      iframe,
      kpis,

      fechaModificacion: report?.fechaModificacion ?? "",
    };

    onSave(newReport);
  };

  const canSave =
    form.nombre.trim() !== "" &&
    form.descripcion.trim() !== "" &&
    form.area !== "" &&
    form.iframe.trim() !== "";

  return (
    <>
      {/* OVERLAY */}
      <div
        className="
          fixed
          inset-0

          bg-black/10
          backdrop-blur-sm

          z-40
        "
        onClick={handleClose}
      />

      {/* DRAWER */}
      <div
        className="
          fixed
          right-0

          bg-white

          z-50

          shadow-2xl

          flex
          flex-col

          w-full
          sm:w-[500px]
        "
        style={{
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        {/* HEADER */}
        <div
          className="
            flex
            justify-between
            items-center

            p-6

            border-b
            border-[--color-border]

            shrink-0
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold

                text-[--color-text-primary]
              "
            >
              {report ? "Editar Reporte" : "Nuevo Reporte"}
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              {report
                ? "Actualiza los datos del reporte."
                : "Completa los campos para actualizar el marketplace."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              w-9
              h-9

              flex
              items-center
              justify-center

              rounded-lg

              hover:bg-[--color-background]

              transition-colors
            "
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1
            min-h-0

            overflow-y-auto

            p-6
          "
        >
          <div
            className="
              space-y-4

              text-[--color-text-muted]
            "
          >
            {/* TITULO */}
            <label htmlFor="nombre" className="block">
              <div
                className="
                  flex
                  items-center
                  gap-1

                  mb-1.5

                  text-xs
                  font-semibold
                  uppercase
                "
              >
                <Text />
                Título
              </div>

              <input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Añadir título..."
                className="
                  w-full

                  border
                  border-[--color-border]

                  rounded-lg

                  p-3

                  text-[--color-text-primary]

                  outline-none

                  focus:border-[--color-accent]
                "
              />
            </label>

            {/* DESCRIPCION */}
            <label htmlFor="descripcion" className="block">
              <div
                className="
                  flex
                  items-center
                  gap-1

                  mb-1.5

                  text-xs
                  font-semibold
                  uppercase
                "
              >
                <TextAlignLeft />
                Descripción
              </div>

              <textarea
                id="descripcion"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Añadir descripción..."
                rows={3}
                className="
                  w-full

                  border
                  border-[--color-border]

                  rounded-lg

                  p-3

                  text-[--color-text-primary]

                  resize-none

                  outline-none

                  focus:border-[--color-accent]
                "
              />
            </label>

            {/* AREA */}
            <label htmlFor="area" className="block">
              <div
                className="
                  mb-1.5

                  text-xs
                  font-semibold
                  uppercase
                "
              >
                Unidad de Negocio
              </div>

              <select
                id="area"
                name="area"
                value={form.area}
                onChange={handleChange}
                className="
                  w-full

                  border
                  border-[--color-border]

                  rounded-lg

                  p-3

                  bg-white

                  text-[--color-text-primary]

                  outline-none

                  focus:border-[--color-accent]
                "
              >
                <option value="" disabled>
                  Seleccione unidad de negocio
                </option>

                {domainUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </label>

            {/* KPIS */}
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-1

                  mb-1.5

                  text-xs
                  font-semibold
                  uppercase
                "
              >
                <Chart />
                KPIs
              </div>

              <div className="flex gap-2">
                <input
                  id="kpi"
                  value={kpiInput}
                  onChange={(event) => setKpiInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddKpi();
                    }
                  }}
                  placeholder="Añadir KPI..."
                  className="
                    w-full

                    border
                    border-[--color-border]

                    rounded-lg

                    p-3

                    text-[--color-text-primary]

                    outline-none

                    focus:border-[--color-accent]
                  "
                />

                <button
                  type="button"
                  onClick={handleAddKpi}
                  className="
                    px-4

                    rounded-lg

                    bg-[--color-accent]

                    text-white
                    font-semibold

                    hover:opacity-90
                  "
                >
                  +
                </button>
              </div>

              {kpis.length > 0 && (
                <div
                  className="
                    flex
                    flex-wrap

                    gap-2

                    mt-3
                  "
                >
                  {kpis.map((kpi, index) => (
                    <div
                      key={`${kpi}-${index}`}
                      className="
                          px-3
                          py-1.5

                          rounded-full

                          bg-[--color-accent-light]

                          text-[--color-accent]

                          flex
                          items-center
                          gap-2

                          text-sm
                          font-medium
                        "
                    >
                      {kpi}

                      <button
                        type="button"
                        onClick={() => handleRemoveKpi(index)}
                        className="
                            hover:opacity-70
                          "
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* IFRAME */}
            <label htmlFor="iframe" className="block">
              <div
                className="
                  flex
                  items-center
                  gap-1

                  mb-1.5

                  text-xs
                  font-semibold
                  uppercase
                "
              >
                <Text />
                Iframe
              </div>

              <textarea
                id="iframe"
                name="iframe"
                value={form.iframe}
                onChange={handleChange}
                placeholder="<iframe... ></iframe>"
                rows={8}
                className="
                  w-full

                  border
                  border-[--color-border]

                  text-[--color-text-primary]

                  rounded-lg

                  p-3

                  font-mono
                  text-sm

                  bg-[--color-background]

                  resize-none
                  overflow-y-auto

                  outline-none

                  focus:border-[--color-accent]
                "
              />
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            p-6

            border-t
            border-[--color-border]

            flex
            justify-end
            gap-3

            shrink-0
          "
        >
          <button
            type="button"
            onClick={handleClose}
            className="
              px-4
              py-2.5

              border
              border-[--color-border]

              rounded-lg

              font-medium

              text-[--color-text-secondary]

              hover:bg-[--color-background]
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="
    px-4
    py-2.5

    bg-[--color-accent]

    text-white
    font-medium

    rounded-lg

    hover:opacity-90

    disabled:opacity-50
    disabled:cursor-not-allowed
  "
          >
            {report ? "Guardar cambios" : "Crear reporte"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportDrawer;
