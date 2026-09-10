import { useMemo, useState } from "react";
import Agent from "components/Agent/Agent";
import { ReactComponent as ArrowUp } from "components/Global/Icons/arrow-up.svg";
import { FaqModel } from "models/Global/faqModel";
import { faqCategories } from "components/AdminPlatform/FaqModal";

interface FaqScreenProps {
  faqData: FaqModel[] | undefined;
  isLoading: boolean;
  hasError?: boolean;
}

const FaqScreen = ({
  faqData,
  isLoading,
  hasError = false,
}: FaqScreenProps) => {
  const [search, setSearch] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<FaqModel["id"] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");

  const faqCat = ["Todas", ...faqCategories];
  const categories = faqCat.map((label) => ({
    label,
    count:
      label === "Todas"
        ? faqData?.length
        : faqData?.filter((faq) => faq.categories.includes(label)).length,
  }));


  /*
   * Las preguntas ahora vienen directamente
   * desde el backend.
   */
  const filteredFaqs = useMemo(() => {
    if (!faqData) {
      return [];
    }

    return faqData.filter((faq) => {
      const normalizedSearch = search.toLowerCase().trim();

      const matchesCategory = activeCategory === "Todas" || faq.categories.includes(activeCategory);
      const matchesSearch =
        normalizedSearch === "" ||
        faq.question.toLowerCase().includes(normalizedSearch) ||
        faq.answer.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

  }, [faqData, activeCategory, search]);

  const handleToggleFaq = (id: FaqModel["id"]) => {
    setOpenFaq((current) => (current === id ? null : id));
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
          <span
            className="
              text-[--color-text-secondary]
            "
          >
            Ayuda y documentación
          </span>

          <span
            className="
              text-[--color-text-muted]
            "
          >
            ›
          </span>

          <span
            className="
              font-semibold

              text-[--color-text-primary]
            "
          >
            Centro de ayuda
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
            Centro de ayuda
          </h1>

          <p
            className="
              text-base
              md:text-lg

              text-[--color-text-secondary]

              max-w-5xl
            "
          >
            Encuentra respuestas y recursos para sacar el máximo provecho de la
            Plataforma Inteligente de Datos.
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
              placeholder="¿Qué necesitas resolver hoy?"
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
                aria-label="Limpiar búsqueda"
                className="
                  px-1

                  text-[--color-text-secondary]

                  hover:text-[--color-accent]

                  transition-colors
                "
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* Categorías */}
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
                    setOpenFaq(null);
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

        {/* FAQ */}
        <section
          className="
            w-full

            mb-10
            md:mb-14
          "
        >
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
                Cargando preguntas frecuentes...
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
                No fue posible cargar las preguntas frecuentes
              </h2>

              <p
                className="
                  text-sm
                  md:text-base

                  text-[--color-text-secondary]
                "
              >
                Ocurrió un problema al obtener la información del Centro de
                ayuda.
              </p>
            </div>
          )}

          {/* RESULTADOS */}
          {!isLoading && !hasError && filteredFaqs.length > 0 && (
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
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`
                          w-full

                          ${index !== filteredFaqs.length - 1
                        ? "border-b border-[--color-border]"
                        : ""
                      }
                        `}
                  >
                    {/* QUESTION */}
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(faq.id)}
                      className={`
                            w-full

                            flex
                            items-center
                            justify-between

                            gap-4

                            text-left

                            px-4
                            md:px-6
                            lg:px-7

                            py-4
                            md:py-5

                            transition-colors

                            ${isOpen
                          ? "bg-[--color-accent-light]"
                          : "bg-white hover:bg-[--color-background]"
                        }
                          `}
                    >
                      <h2
                        className="
                              text-base
                              md:text-lg
                              lg:text-xl

                              font-bold

                              text-[--color-text-primary]
                            "
                      >
                        {faq.question}
                      </h2>

                      <ArrowUp
                        className={`
                              w-5
                              h-5

                              md:w-6
                              md:h-6

                              flex-shrink-0

                              transition-transform
                              duration-300

                              ${isOpen
                            ? "rotate-0 text-[--color-accent]"
                            : "rotate-180 text-[--color-text-secondary]"
                          }
                            `}
                      />
                    </button>

                    {/* ANSWER */}
                    <div
                      className={`
                            grid

                            transition-all
                            duration-300
                            ease-in-out

                            ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                          `}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="
                                px-4
                                md:px-6
                                lg:px-7

                                pb-5
                                md:pb-6

                                bg-[--color-accent-light]
                              "
                        >
                          <p
                            className="
                                  text-sm
                                  md:text-base

                                  text-[--color-text-secondary]

                                  leading-relaxed

                                  max-w-5xl
                                "
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SIN RESULTADOS */}
          {!isLoading && !hasError && filteredFaqs.length === 0 && (
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
                No encontramos resultados
              </h2>

              <p
                className="
                    text-sm
                    md:text-base

                    text-[--color-text-secondary]
                  "
              >
                Intenta buscar con otras palabras.
              </p>
            </div>
          )}
        </section>

        <Agent />
      </div>
    </main>
  );
};

export default FaqScreen;
