import { useMemo, useState } from "react";

import Agent from "../../../components/Agent/Agent";
import { conceptIcons, conceptCategories } from "components/AdminPlatform/ConceptModal";
import { ReactComponent as ArrowUp } from "components/Global/Icons/arrow-up.svg";
import { ReactComponent as Danger } from "components/Global/Icons/danger.svg";

import { DictionaryModel } from "models/Global/dictionaryModel";

interface ConceptosScreenProps {
  dictionaryData: DictionaryModel[] | undefined;
  isLoading: boolean;
  hasError?: boolean;
};

const ConceptosScreen = ({
  dictionaryData,
  isLoading,
  hasError = false,
}: ConceptosScreenProps) => {
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [openConcept, setOpenConcept] = useState<DictionaryModel["id"] | null>(null);

  const conceptCats = ["Todos", ...conceptCategories];

  const categories = conceptCats.map((label) => ({
    label,
    count:
      label === "Todos"
        ? dictionaryData?.length
        : dictionaryData?.filter((concept) =>
          concept.categories.includes(label),
        ).length,
  }));


  const filteredConcepts = useMemo(() => {
    if (!dictionaryData) {
      return [];
    }

    return dictionaryData.filter((concept) => {
      const normalizedSearch = search.toLowerCase().trim();

      const name = concept.name?.toLowerCase() || "";
      const description = concept.description?.toLowerCase() || "";
      const matchesCategory = activeCategory === "Todos" || concept.categories.includes(activeCategory);


      return (
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch)
      ) && matchesCategory;
    });
  }, [dictionaryData, search, activeCategory]);

  const handleToggleConcept = (id: DictionaryModel["id"]) => {
    setOpenConcept((current) => (current === id ? null : id));
  };

  const getSummary = (description: string) => {
    const maxLength = 180;

    if (!description) {
      return "";
    }

    if (description.length <= maxLength) {
      return description;
    }

    return `${description.slice(0, maxLength).trim()}...`;
  };

  return (
    <main
      className="
        flex
        flex-col
        items-start

        w-full
        min-h-full

        text-left

        py-6
        md:py-8
      "
    >
      <div
        className="
          w-full
          max-w-[1600px]

          mx-auto

          px-4
          md:px-6
          lg:px-8
        "
      >
        {/* BREADCRUMB */}
        <div
          className="
            flex
            items-center
            gap-2

            text-xs
            md:text-sm

            mb-6
          "
        >
          <span className="text-[--color-text-secondary]">
            Ayuda y documentación
          </span>

          <span className="text-[--color-text-muted]">›</span>

          <span
            className="
              font-semibold

              text-[--color-text-primary]
            "
          >
            Diccionario de conceptos
          </span>
        </div>

        {/* HEADER */}
        <section className="w-full mb-6">
          <h1
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl

              font-bold

              text-[--color-accent]

              mb-3
            "
          >
            Diccionario de conceptos
          </h1>

          <p
            className="
              text-base
              md:text-lg

              text-[--color-text-secondary]

              max-w-5xl
            "
          >
            Conoce los conceptos clave de la Plataforma Inteligente de Datos
            para comprender mejor la información, los indicadores y los
            productos de datos disponibles.
          </p>
        </section>

        {/* BUSCADOR */}
        <section className="w-full mb-5">
          <div
            className="
              w-full

              bg-white

              border
              border-[--color-border]

              rounded-xl

              flex
              items-center
              gap-3

              px-4
              md:px-5

              h-14
              md:h-16

              focus-within:border-[--color-accent]

              transition-colors
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="
                w-5
                h-5

                md:w-6
                md:h-6

                flex-shrink-0

                text-[--color-text-secondary]
              "
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busca un concepto o término"
              className="
                w-full
                h-full

                bg-transparent

                outline-none

                text-sm
                md:text-base

                text-[--color-text-primary]

                placeholder:text-[--color-text-muted]
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  px-1

                  text-[--color-text-secondary]

                  hover:text-[--color-accent]

                  transition-colors
                "
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* Categorías */}
        {!isLoading && !hasError && (
          <section className="w-full mb-8 md:mb-10">
            <div
              className="
              flex
              gap-2
              md:gap-3
              overflow-x-auto
              pb-2
              md:pb-0
            "
            >
              {categories.map((category) => {
                const isActive = activeCategory === category.label;

                return (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.label);
                      setOpenConcept(null);
                    }}
                    className={`
                    flex-shrink-0
                    px-4
                    md:px-5
                    py-2
                    rounded-full
                    border
                    text-xs
                    md:text-sm
                    transition-all
                    ${isActive
                        ? `
                          bg-[--color-accent]
                          border-[--color-accent]
                          text-white
                        `
                        : `
                          bg-white
                          border-[--color-border]
                          text-[--color-text-secondary]
                          hover:border-[--color-accent]
                          hover:text-[--color-accent]
                        `
                      }
                  `}
                  >
                    {category.label} ({category.count})
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* CONCEPTOS */}
        <section className="w-full mb-10 md:mb-14">
          {/* LOADING */}
          {isLoading && (
            <div
              className="
                w-full

                bg-white

                border
                border-[--color-border]

                rounded-[18px]

                py-16
                px-5

                flex
                flex-col
                items-center
                justify-center
              "
            >
              <div
                className="
                  w-10
                  h-10

                  rounded-full

                  border-2
                  border-[--color-border]
                  border-t-[--color-accent]

                  animate-spin
                "
              />

              <p
                className="
                  mt-4

                  text-sm
                  md:text-base

                  text-[--color-text-secondary]
                "
              >
                Cargando conceptos...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!isLoading && hasError && (
            <div
              className="
                w-full

                bg-white

                border
                border-[--color-border]

                rounded-[18px]

                py-12
                px-5

                text-center
              "
            >
              <h2
                className="
                  text-lg
                  md:text-xl

                  font-bold

                  text-[--color-text-primary]

                  mb-2
                "
              >
                No fue posible cargar los conceptos
              </h2>

              <p
                className="
                  text-sm
                  md:text-base

                  text-[--color-text-secondary]
                "
              >
                Ocurrió un problema al obtener la información del diccionario.
              </p>
            </div>
          )}

          {/* LISTA */}
          {!isLoading && !hasError && filteredConcepts.length > 0 && (
            <div
              className="
                  w-full

                  bg-white

                  border
                  border-[--color-border]

                  rounded-[18px]

                  overflow-hidden
                "
            >
              {filteredConcepts.map((concept, index) => {
                const isOpen = openConcept === concept.id;
                const icon = conceptIcons.find((x) => x.name === concept.icon);
                const description = concept.description || "";

                return (
                  <div
                    key={concept.id}
                    className={`
                        w-full

                        ${index !== filteredConcepts.length - 1
                        ? "border-b border-[--color-border]"
                        : ""
                      }
                      `}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleConcept(concept.id)}
                      className={`
                          w-full

                          flex
                          items-start

                          gap-4
                          md:gap-5

                          text-left

                          px-4
                          md:px-6
                          lg:px-7

                          py-5
                          md:py-6

                          transition-colors

                          ${isOpen
                          ? "bg-[--color-accent-light]"
                          : "bg-white hover:bg-[--color-background]"
                        }
                        `}
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
                        {icon !== undefined ? (
                          icon.element
                        ) : (
                          <Danger className="w-5 h-5 md:w-6 md:h-6" />
                        )}
                      </div>

                      {/* INFORMACIÓN */}
                      <div
                        className="
                            flex-1

                            min-w-0
                          "
                      >
                        <h2
                          className="
                              text-base
                              md:text-lg
                              lg:text-xl

                              font-bold

                              text-[--color-text-primary]

                              mb-2
                            "
                        >
                          {concept.name}
                        </h2>
                        <p
                          className="
                                text-xs
                                md:text-sm
                                text-[--color-text-secondary]
                                leading-relaxed
                              "
                        >
                          <b>Definici&oacute;n:</b> {concept.summary}
                        </p>

                        {/* RESUMEN */}
                        {!isOpen && (
                          <p
                            className="
                                text-sm
                                md:text-base

                                text-[--color-text-secondary]

                                leading-relaxed
                              "
                          >
                            <b>Descripci&oacute;n:</b> {getSummary(description)}
                          </p>
                        )}

                        {/* DESCRIPCIÓN COMPLETA */}
                        <div
                          className={`
                              grid

                              transition-all
                              duration-300
                              ease-in-out

                              ${isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                            }
                            `}
                        >
                          <div className="overflow-hidden">
                            <div className="pt-1">
                              <p
                                className="
                                    text-sm
                                    md:text-base
                                    lg:text-lg

                                    text-[--color-text-secondary]

                                    leading-relaxed

                                    max-w-5xl
                                  "
                              >
                                {description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FLECHA */}
                      <ArrowUp
                        className={`
                            w-5
                            h-5

                            md:w-6
                            md:h-6

                            mt-1

                            flex-shrink-0

                            transition-all
                            duration-300

                            ${isOpen
                            ? "rotate-0 text-[--color-accent]"
                            : "rotate-180 text-[--color-text-secondary]"
                          }
                          `}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* SIN RESULTADOS */}
          {!isLoading && !hasError && filteredConcepts.length === 0 && (
            <div
              className="
                  w-full

                  bg-white

                  border
                  border-[--color-border]

                  rounded-[18px]

                  py-12
                  px-5

                  text-center
                "
            >
              <h2
                className="
                    text-lg
                    md:text-xl

                    font-bold

                    text-[--color-text-primary]

                    mb-2
                  "
              >
                No encontramos conceptos
              </h2>

              <p
                className="
                    text-sm
                    md:text-base

                    text-[--color-text-secondary]
                  "
              >
                Intenta buscar con otro término.
              </p>
            </div>
          )}
        </section>

        <Agent />
      </div>
    </main>
  );
};

export default ConceptosScreen;
