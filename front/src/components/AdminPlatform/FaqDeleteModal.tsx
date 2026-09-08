import { FaqModel } from "models/Global/faqModel";

interface Props {
  faq: FaqModel;
  onClose: () => void;
  onDelete: (faq: FaqModel) => void;
};

const FaqDeleteModal = ({ faq, onClose, onDelete }: Props) => {

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
              ¿Est&aacute; seguro de eliminar este elemento?
            </h2>
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
            onClick={() => onDelete(faq)}
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
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqDeleteModal;
