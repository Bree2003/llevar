import { useMemo, useState } from "react";
import { ReactComponent as Danger } from "components/Global/Icons/danger.svg";
import ConceptModal, { ActionKind, conceptIcons } from "./ConceptModal";
import ConceptDeleteModal from "./ConceptDeleteModal";
import { DictionaryModel } from "models/Global/dictionaryModel";

const ConceptsAdminSection = ({
  dictionaryData,
  isBusy,
  isLoading,
  handleDictionaryCreate,
  handleDictionaryUpdate,
  handleDictionaryDelete,
}: {
  dictionaryData: DictionaryModel[] | undefined;
  isBusy: boolean;
  isLoading: boolean;
  handleDictionaryCreate: (dictionary: DictionaryModel) => void;
  handleDictionaryUpdate: (dictionary: DictionaryModel) => void;
  handleDictionaryDelete: (dictionary: DictionaryModel) => void;
}) => {
  const [search, setSearch] = useState("");
  const [editingConcept, setEditingConcept] = useState<DictionaryModel | null>(null);
  const [deleteModal, setDeleteModal] = useState<DictionaryModel | null>(null);

  const filteredConcepts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!dictionaryData) {
      return [];
    }

    if (!query) {
      return dictionaryData;
    }

    return dictionaryData.filter(
      (dictionary) =>
        dictionary.name.toLowerCase().includes(query) ||
        dictionary.description.toLowerCase().includes(query),
    );
  }, [dictionaryData, search]);

  const handleOnDictionaryChange = (dictionary: DictionaryModel, kind: ActionKind) => {
    if (kind === "Create") {
      handleDictionaryCreate(dictionary);
    }

    if (kind === "Update") {
      handleDictionaryUpdate(dictionary);
    }

    setEditingConcept(null);
    return;
  };

  const handleOnDictionaryDelete = (dictionary: DictionaryModel) => {
    handleDictionaryDelete(dictionary);
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
          text-left
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
              Diccionario de conceptos
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Administra los conceptos visibles para los usuarios.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingConcept({
                id: "",
                name: "",
                summary: "",
                description: "",
                icon: "",
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
            "
          >
            + Nuevo concepto
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
              placeholder="Buscar concepto..."
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

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table
            className="
              w-full

              min-w-[650px]

              text-sm
            "
          >
            <thead
              className="
                bg-[--color-background]

                text-[--color-text-muted]
              "
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Icono
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Concepto
                </th>

                <th className="px-6 py-3 text-left text-xs uppercase">
                  Definición
                </th>

                <th className="px-6 py-3 text-left text-xs uppercase">
                  Descripción
                </th>

                <th className="px-6 py-3 text-right text-xs uppercase">
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
              {filteredConcepts.map((concept) => (
                <tr
                  key={concept.id}
                  className="
                      hover:bg-[--color-background]

                      transition-colors
                    "
                >
                  <td
                    className="
                        px-6
                        py-4

                        font-semibold

                        text-[--color-text-primary]
                      "
                  >
                    {/* ICONO */}
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
                      {conceptIcons.find((x) => x.name === concept.icon)?.element ?? <Danger className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                  </td>
                  <td
                    className="
                        px-6
                        py-4

                        font-semibold

                        text-[--color-text-primary]
                      "
                  >
                    {concept.name}
                  </td>

                  <td
                    className="
                        px-6
                        py-4

                        text-[--color-text-secondary]
                      "
                  >
                    {concept.summary}
                  </td>

                  <td
                    className="
                        px-6
                        py-4

                        text-[--color-text-secondary]
                      "
                  >
                    {concept.description}
                  </td>

                  <td className="px-6 py-4">
                    <div
                      className="
                          flex
                          justify-end
                          gap-1
                        "
                    >
                      <button
                        type="button"
                        onClick={() => setEditingConcept(concept)}
                        className="
                            px-3
                            py-2

                            rounded-lg

                            font-semibold

                            text-[--color-accent]

                            hover:bg-[--color-accent-light]
                          "
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteModal(concept)}
                        className="
                            px-3
                            py-2

                            rounded-lg

                            font-semibold

                            text-red-600

                            hover:bg-red-50
                          "
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredConcepts.length === 0 && (
            <div
              className="
                py-12

                text-center

                text-sm

                text-[--color-text-secondary]
              "
            >
              No se encontraron conceptos.
            </div>
          )}
        </div>
      </section>

      {editingConcept && (
        <ConceptModal
          concept={editingConcept}
          onClose={() => setEditingConcept(null)}
          onSave={handleOnDictionaryChange}
        />
      )}

      {deleteModal && (
        <ConceptDeleteModal
          dictionary={deleteModal}
          onClose={() => setDeleteModal(null)}
          onDelete={handleOnDictionaryDelete}
        />
      )}
    </>
  );
};

export default ConceptsAdminSection;
