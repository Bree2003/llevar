import { useEffect, useState } from "react";

import { ReactComponent as Text } from "components/Global/Icons/text.svg";
import { ReactComponent as TextAlignLeft } from "components/Global/Icons/textalign-left.svg";
import { ReactComponent as Chart } from "components/Global/Icons/chart.svg";
import { ReactComponent as ArrowRight } from "components/Global/Icons/arrow-right.svg";
import { ReactComponent as Close } from "components/Global/Icons/close.svg";
import { domainUnits } from "data/domain-units";

import { Report } from "./types";

interface ReportDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (report: Report) => void;
    report?: Report | null;
}

const initialForm = {
    nombre: "",
    descripcion: "",
    area: "",
    dataset: "",
    iframe: "",
};

const getDomainUnitId = (area: string) => {
    const domainUnit = domainUnits.find(
        (unit) => unit.id === area || unit.name === area
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
                dataset: report.dataset,
                iframe: report.iframe,
            });

            setKpis(report.kpis);
            setKpiInput("");
        } else {
            setForm(initialForm);
            setKpis([]);
            setKpiInput("");
        }
    }, [report, isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddKpi = () => {
        const normalizedKpi = kpiInput.trim();

        if (!normalizedKpi) return;

        setKpis((prev) => [...prev, normalizedKpi]);
        setKpiInput("");
    };

    const handleRemoveKpi = (index: number) => {
        setKpis((prev) => prev.filter((_, i) => i !== index));
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
            .replace(/[\u0300-\u036f]/g, "") // elimina tildes
            .replace(/[^a-z0-9\s-]/g, "") // elimina %, $, &, etc.
            .trim()
            .replace(/\s+/g, "-") // espacios → guiones
            .replace(/-+/g, "-"); // evita guiones duplicados
    };

    const handleSave = () => {
        const newReport: Report = {
            id:
                report?.id ??
                generateReportId(form.nombre),
            nombre: form.nombre,
            descripcion: form.descripcion,
            dataset: form.dataset,
            area: form.area,
            iframe: form.iframe,
            kpis,
            fechaModificacion: new Date().toISOString().split("T")[0],
        };

        onSave(newReport);
        resetForm();
        onClose();
    };

    return (
        <>
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

            <div
                className="
                    fixed
                    right-0
                    bg-white
                    z-50
                    shadow-2xl
                    flex
                    flex-col
                    w-[500px]
                "
                style={{
                    top: NAVBAR_HEIGHT,
                    height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
                }}
            >
                <div className="flex justify-between items-center p-6 border-b shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-[--color-text-primary]">
                            {report ? "Editar Reporte" : "Nuevo Reporte"}
                        </h2>

                        <p className="text-sm text-[--color-text-secondary]">
                            {report
                                ? "Actualiza los datos del reporte."
                                : "Completa los campos para actualizar el marketplace."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                    >
                        <Close className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-6">
                    <div className="space-y-4 text-[--color-text-muted]">
                        <label
                            htmlFor="nombre"
                            className="block"
                        >
                            <div className="flex items-center gap-1 uppercase">
                                <Text />
                                Título
                            </div>

                            <input
                                id="nombre"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Añadir título..."
                                className="w-full border rounded-lg p-3 mb-3"
                            />
                        </label>

                        <label
                            htmlFor="descripcion"
                            className="block"
                        >
                            <div className="flex items-center gap-1 uppercase">
                                <TextAlignLeft />
                                Descripción
                            </div>

                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                placeholder="Añadir descripción..."
                                className="w-full border rounded-lg p-3 mb-3 resize-none overflow-y-auto"
                                rows={2}
                            />
                        </label>

                        <label
                            htmlFor="area"
                            className="block"
                        >
                            <div className="flex items-center gap-1 uppercase">
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
                                    mb-3
                                    bg-white
                                "
                            >
                                <option value="" disabled>
                                    Seleccione unidad de negocio
                                </option>

                                {domainUnits.map((unit) => (
                                    <option
                                        key={unit.id}
                                        value={unit.id}
                                    >
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label
                            htmlFor="kpi"
                            className="block"
                        >
                            <div className="flex items-center gap-1 uppercase">
                                <Chart />
                                KPIs
                            </div>

                            <div className="flex gap-2">
                                <input
                                    id="kpi"
                                    value={kpiInput}
                                    onChange={(event) =>
                                        setKpiInput(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleAddKpi();
                                        }
                                    }}
                                    placeholder="Añadir KPI..."
                                    className="w-full border rounded-lg p-3"
                                />

                                <button
                                    type="button"
                                    onClick={handleAddKpi}
                                    className="
                                        px-4
                                        rounded-lg
                                        bg-[--color-accent]
                                        text-white
                                    "
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {kpis.map((kpi, index) => (
                                    <div
                                        key={`${kpi}-${index}`}
                                        className="
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-orange-100
                                            text-orange-700
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        {kpi}

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveKpi(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </label>

                        <label
                            htmlFor="dataset"
                            className="block"
                        >
                            <div className="flex items-center gap-1 uppercase">
                                <div className="flex">
                                    <ArrowRight className="text-[--color-accent] rotate-90" />
                                    <ArrowRight className="text-[--color-accent] -rotate-90 -ml-1" />
                                </div>

                                Dataset
                            </div>

                            <input
                                id="dataset"
                                name="dataset"
                                value={form.dataset}
                                onChange={handleChange}
                                placeholder="Añadir dataset..."
                                className="w-full border rounded-lg p-3 mb-3"
                            />
                        </label>

                        <label
                            htmlFor="iframe"
                            className="block"
                        >
                            <div className="flex items-center gap-1 uppercase">
                                <Text />
                                Iframe
                            </div>

                            <textarea
                                id="iframe"
                                name="iframe"
                                value={form.iframe}
                                onChange={handleChange}
                                placeholder="<iframe... ></iframe>"
                                className="
                                    w-full
                                    border
                                    border-[--color-border]
                                    text-[--color-text-muted]
                                    rounded-lg
                                    p-3
                                    font-mono
                                    bg-[--color-surface-secondary]
                                    resize-none
                                    overflow-y-auto
                                "
                                rows={8}
                            />
                        </label>
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            px-4
                            py-2
                            border
                            rounded-lg
                        "
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="
                            px-4
                            py-2
                            bg-[--color-accent]
                            text-white
                            rounded-lg
                        "
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </>
    );
};

export default ReportDrawer;