import { useMemo, useState } from "react";
import FaqModal, { ActionKind } from "./FaqModal";
import FaqDeleteModal from "./FaqDeleteModal";
import { FaqModel } from "models/Global/faqModel";

const FaqAdminSection = ({
  faqData,
  isBusy,
  isLoading,
  handleFaqCreate,
  handleFaqUpdate,
  handleFaqDelete,
}: {
  faqData: FaqModel[] | undefined;
  isBusy: boolean;
  isLoading: boolean;
  handleFaqCreate: (faq: FaqModel) => void;
  handleFaqUpdate: (faq: FaqModel) => void;
  handleFaqDelete: (faq: FaqModel) => void;
}) => {
  const [search, setSearch] = useState("");
  const [editingFaq, setEditingFaq] = useState<FaqModel | null>(null);
  const [deleteModal, setDeleteModal] = useState<FaqModel | null>(null);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!faqData) {
      return [];
    }

    if (!query) {
      return faqData;
    }

    return faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query),
    );
  }, [faqData, search]);

  const handleOnFaqChange = (faq: FaqModel, kind: ActionKind) => {
    if (kind === "Create") {
      handleFaqCreate(faq);
    }

    if (kind === "Update") {
      handleFaqUpdate(faq);
    }

    setEditingFaq(null);
    return;
  };

  const handleOnFaqDelete = (faq: FaqModel) => {
    handleFaqDelete(faq);
    setDeleteModal(null);
    return;
  };

  return (
    <>
      <section
        className="
          bg-white

          border
          border-[--color-border]

          rounded-xl

          overflow-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            p-5
            md:p-6

            flex
            flex-col

            sm:flex-row
            sm:items-center
            sm:justify-between

            gap-4

            border-b
            border-[--color-border]
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-bold

                text-[--color-text-primary]
              "
            >
              Preguntas frecuentes
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Administra el contenido disponible en el Centro de ayuda.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingFaq({
                id: "",
                question: "",
                answer: "",
                categories: [],
                createdAt: "",
                updatedAt: "",
              })
            }
            className="
              px-4
              py-2.5

              rounded-lg

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold

              hover:opacity-90

              transition-opacity
            "
          >
            + Nueva pregunta
          </button>
        </div>

        {/* SEARCH */}
        <div
          className="
            p-4
            md:px-6

            bg-[--color-background]

            border-b
            border-[--color-border]
          "
        >
          <div
            className="
              relative

              w-full
              max-w-md
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="
                absolute
                left-3
                top-1/2

                -translate-y-1/2

                w-4
                h-4

                text-[--color-text-muted]
              "
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar pregunta..."
              className="
                w-full

                pl-10
                pr-4

                py-2.5

                bg-white

                border
                border-[--color-border]

                rounded-lg

                text-sm

                outline-none

                focus:border-[--color-accent]
              "
            />
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            divide-y
            divide-[--color-border]
          "
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="
                  p-5
                  md:px-6

                  flex
                  flex-col

                  md:flex-row
                  md:items-start
                  md:justify-between

                  gap-4

                  hover:bg-[--color-background]

                  transition-colors
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      font-semibold

                      text-[--color-text-primary]
                    "
                  >
                    {faq.question}
                  </p>

                  <p
                    className="
                      mt-2

                      text-sm
                      leading-relaxed

                      text-[--color-text-secondary]
                    "
                  >
                    {faq.answer}
                  </p>
                </div>

                <div
                  className="
                    flex
                    gap-1

                    flex-shrink-0
                  "
                >
                  <button
                    type="button"
                    onClick={() => setEditingFaq(faq)}
                    className="
                      px-3
                      py-2

                      rounded-lg

                      text-sm
                      font-semibold

                      text-[--color-accent]

                      hover:bg-[--color-accent-light]
                    "
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteModal(faq)}
                    className="
                      px-3
                      py-2

                      rounded-lg

                      text-sm
                      font-semibold

                      text-red-600

                      hover:bg-red-50
                    "
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              className="
                py-12

                text-center

                text-sm

                text-[--color-text-secondary]
              "
            >
              No se encontraron preguntas.
            </div>
          )}
        </div>
      </section>

      {editingFaq && (
        <FaqModal
          faq={editingFaq}
          onClose={() => setEditingFaq(null)}
          onSave={handleOnFaqChange}
        />
      )}

      {deleteModal && (
        <FaqDeleteModal
          faq={deleteModal}
          onClose={() => setDeleteModal(null)}
          onDelete={handleOnFaqDelete}
        />
      )}
    </>
  );
};

export default FaqAdminSection;
