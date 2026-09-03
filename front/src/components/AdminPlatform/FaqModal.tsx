import { useState } from "react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  faq: FaqItem;
  onClose: () => void;
  onSave: (faq: FaqItem) => void;
}

const FaqModal = ({ faq, onClose, onSave }: Props) => {
  const [form, setForm] = useState<FaqItem>(faq);

  const isValid = form.question.trim() !== "" && form.answer.trim() !== "";

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
              {faq.id ? "Editar pregunta" : "Nueva pregunta"}
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Define la pregunta y su respuesta para el Centro de ayuda.
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
          <Field label="Pregunta">
            <input
              value={form.question}
              onChange={(event) =>
                setForm({
                  ...form,
                  question: event.target.value,
                })
              }
              placeholder="Ej: ¿Cómo puedo solicitar acceso?"
              className={inputStyle}
            />
          </Field>

          <Field label="Respuesta">
            <textarea
              value={form.answer}
              onChange={(event) =>
                setForm({
                  ...form,
                  answer: event.target.value,
                })
              }
              placeholder="Escribe la respuesta..."
              rows={6}
              className={`
                ${inputStyle}

                resize-none
              `}
            />
          </Field>
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
            onClick={() => onSave(form)}
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

export default FaqModal;
