import { useState, ChangeEvent } from "react";
import { ReactComponent as Box } from "components/Global/Icons/box.svg";
import { ReactComponent as Chart } from "components/Global/Icons/chart.svg";
import { ReactComponent as Data } from "components/Global/Icons/data.svg";
import { ReactComponent as Danger } from "components/Global/Icons/danger.svg";
import { DictionaryModel } from "models/Global/dictionaryModel";

export type ActionKind = "Create" | "Update" | "Delete";

interface Props {
  concept: DictionaryModel;
  onClose: () => void;
  onSave: (concept: DictionaryModel, kind: ActionKind) => void;
};

export const conceptCategories = [
  "Datos y modelos",
  "Indicadores",
  "Procesos",
  "Negocio",
  "Reportes",
];

export const conceptIcons = [
  { "name": "chart", "element": <Chart className="w-5 h-5 md:w-6 md:h-6" /> },
  { "name": "box", "element": <Box className="w-5 h-5 md:w-6 md:h-6" /> },
  { "name": "data", "element": <Data className="w-5 h-5 md:w-6 md:h-6" /> },
];

const ConceptModal = ({ concept, onClose, onSave }: Props) => {
  const [form, setForm] = useState<DictionaryModel>(concept);
  const isValid = form.name.trim() !== "" && form.icon.trim() !== "" && form.summary.trim() !== "" && form.description.trim() !== "";

  const toggleCategory = (category: string) => {
    setForm((prev) => {
      const current = prev.categories ?? [];
      return {
        ...prev,
        categories: current.includes(category)
          ? current.filter((c) => c !== category)
          : [...current, category],
      };
    });
  };

  const handleIconChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      icon: e.target.value,
    });
  };

  return (
    <div
      className="
        fixed
        inset-0

        z-[100]

        bg-black/60

        flex
        items-center
        justify-center

        p-4
      "
    >
      <div
        className="
          w-full
          max-w-xl

          max-h-[calc(100dvh-2rem)]

          bg-white

          rounded-xl

          shadow-2xl

          flex
          flex-col

          overflow-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            px-5
            py-4

            flex
            items-center
            justify-between

            border-b
            border-[--color-border]
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold

                text-[--color-text-primary]
              "
            >
              {concept.id ? "Editar concepto" : "Nuevo concepto"}
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Define el término y la explicación que se mostrará en el
              diccionario.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-9
              h-9

              rounded-lg

              text-xl

              text-[--color-text-secondary]

              hover:bg-[--color-background]
            "
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div
          className="
            flex-1
            min-h-0

            overflow-y-auto

            p-5

            space-y-5
          "
        >
          <Field label="Concepto">
            <input
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              placeholder="Ej: Producto de datos"
              className={inputStyle}
            />
          </Field>

          <Field label="Definición">
            <textarea
              value={form.summary}
              onChange={(event) =>
                setForm({
                  ...form,
                  summary: event.target.value,
                })
              }
              placeholder="Escribe la definición..."
              rows={2}
              className={`
                ${inputStyle}

                resize-none
              `}
            />
          </Field>

          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description: event.target.value,
                })
              }
              placeholder="Escribe la descripción..."
              rows={3}
              className={`
                ${inputStyle}

                resize-none
              `}
            />
          </Field>

          <Field label="Categorías">
            <div className="flex flex-wrap gap-3">
              {(conceptCategories ?? []).map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(form.categories ?? []).includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </Field>

          <div
            className="
              flex-1
              min-h-0

              overflow-y-auto

              p-5

              space-y-5
            "
          >
            {/* LISTA DE ICONOS */}
            <Field label="Icono">
              <div className="flex gap-8">
                <div
                  className="
                    w-11
                    h-11

                    md:w-12
                    md:h-12

                    rounded-full

                    bg-[--color-accent-light]

                    text-[--color-accent]

                    flex
                    items-center
                    justify-center

                    flex-shrink-0
                  "
                >
                  {conceptIcons.find((x) => x.name === form.icon)?.element ?? <Danger className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <select
                  id="icon-select"
                  value={form.icon}
                  onChange={handleIconChange}
                  className={inputStyle}
                >
                  {conceptIcons.map((x) => (
                    <option value={x.name}>{x.name}</option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            px-5
            py-4

            border-t
            border-[--color-border]

            flex
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              px-4
              py-2.5

              rounded-lg

              border
              border-[--color-border]

              text-sm
              font-semibold

              text-[--color-text-secondary]

              hover:bg-[--color-background]
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSave(form, concept.id ? "Update" : "Create")}
            className="
              px-4
              py-2.5

              rounded-lg

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold

              hover:opacity-90

              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label
      className="
        block

        mb-1.5

        text-sm
        font-semibold

        text-[--color-text-primary]
      "
    >
      {label}
    </label>

    {children}
  </div>
);

const inputStyle = `
  w-full

  px-3
  py-2.5

  bg-white

  border
  border-[--color-border]

  rounded-lg

  text-sm

  outline-none

  focus:border-[--color-accent]
`;

export default ConceptModal;
