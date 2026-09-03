import { useMemo, useState } from "react";
import ConceptModal, { ConceptItem } from "./ConceptModal";

const INITIAL_CONCEPTS: ConceptItem[] = [
  {
    id: "1",
    term: "Producto de datos",
    definition:
      "Conjunto de datos preparado y administrado para responder a una necesidad de negocio.",
  },
  {
    id: "2",
    term: "Dominio",
    definition:
      "Área utilizada para organizar productos, accesos y responsabilidades.",
  },
];

const ConceptsAdminSection = () => {
  const [concepts, setConcepts] = useState<ConceptItem[]>(INITIAL_CONCEPTS);

  const [search, setSearch] = useState("");

  const [editingConcept, setEditingConcept] = useState<ConceptItem | null>(
    null,
  );

  const filteredConcepts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return concepts;
    }

    return concepts.filter(
      (concept) =>
        concept.term.toLowerCase().includes(query) ||
        concept.definition.toLowerCase().includes(query),
    );
  }, [concepts, search]);

  const handleSave = (savedConcept: ConceptItem) => {
    setConcepts((previous) => {
      const exists = previous.some((concept) => concept.id === savedConcept.id);

      if (!exists) {
        return [
          ...previous,
          {
            ...savedConcept,
            id: Date.now().toString(),
          },
        ];
      }

      return previous.map((concept) =>
        concept.id === savedConcept.id ? savedConcept : concept,
      );
    });

    setEditingConcept(null);
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
                term: "",
                definition: "",
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
                  Concepto
                </th>

                <th className="px-6 py-3 text-left text-xs uppercase">
                  Definición
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
                    {concept.term}
                  </td>

                  <td
                    className="
                        px-6
                        py-4

                        text-[--color-text-secondary]
                      "
                  >
                    {concept.definition}
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
                        onClick={() =>
                          setConcepts((previous) =>
                            previous.filter((item) => item.id !== concept.id),
                          )
                        }
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
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default ConceptsAdminSection;
