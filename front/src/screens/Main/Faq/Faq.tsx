import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Agent from "../../../components/Agent/Agent";

import { ReactComponent as ArrowUp } from "components/Global/Icons/arrow-up.svg";

const FaqScreen = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Qué es la Plataforma Inteligente de Datos?",
      answer:
        "La Plataforma Inteligente de Datos es el punto central para acceder, gestionar y utilizar información confiable dentro de la organización. Reúne productos de datos, reportes certificados, capacidades de ingesta y herramientas de administración en una experiencia unificada. Su objetivo es facilitar el acceso a información de calidad, reducir esfuerzos manuales y apoyar una toma de decisiones más rápida y basada en datos.",
      categories: ["Plataforma"],
    },
    {
      question: "¿Qué es un producto de datos?",
      answer:
        "Un producto de datos es un recurso construido a partir de información organizada, gobernada y preparada para responder a una necesidad concreta del negocio. Puede incluir reportes, dashboards, indicadores, tablas o conjuntos de datos que permiten analizar información y tomar decisiones. Dentro del Data Marketplace podrás encontrar estos productos junto con su contexto y la información necesaria para utilizarlos correctamente.",
      categories: ["Data Marketplace"],
    },
    {
      question: "¿Cómo encuentro información para mi área?",
      answer:
        "Puedes explorar el Data Marketplace para encontrar productos de datos y reportes disponibles para las distintas áreas de la organización. Busca la información relacionada con tu unidad de negocio, revisa los productos disponibles y consulta su descripción para identificar cuál responde mejor a tu necesidad. La plataforma busca centralizar esta información para evitar que tengas que buscar datos en distintas fuentes o herramientas.",
      categories: ["Data Marketplace"],
    },
    {
      question: "¿Cómo solicito acceso a un reporte?",
      answer:
        "Si un reporte o producto de datos requiere permisos adicionales, deberás seguir el flujo de solicitud de acceso disponible para ese recurso. Los accesos se gestionan de acuerdo con los permisos definidos para cada producto de datos y las necesidades de cada usuario. Si no encuentras la opción de solicitud o necesitas un permiso especial, puedes contactar al responsable del producto o al equipo administrador de la plataforma.",
      categories: ["Accesos y permisos", "Data Marketplace"],
    },
    {
      question: "¿Cómo puedo cargar información en la plataforma?",
      answer:
        "La carga y actualización de información se realiza desde las capacidades de Ingesta de datos. Desde allí puedes incorporar información necesaria para los productos de datos y mantener actualizadas las fuentes utilizadas por la organización. Dependiendo del caso, podrás trabajar con tablas existentes, actualizar información manual o iniciar la incorporación de una nueva fuente de datos.",
      categories: ["Ingestas de datos"],
    },
    {
      question: "¿Cómo reporto un problema de calidad de datos?",
      answer:
        "Si detectas información incorrecta, incompleta, desactualizada o inconsistente, primero identifica el producto de datos o reporte donde encontraste el problema. Luego entrega el mayor contexto posible, indicando qué dato presenta la inconsistencia, dónde lo encontraste y qué comportamiento esperabas. Esto permitirá que el equipo responsable pueda revisar el origen de la información y realizar las correcciones necesarias.",
      categories: ["Accesos y permisos"],
    },
    {
      question: "¿Con qué frecuencia se actualiza la información?",
      answer:
        "La frecuencia de actualización depende de cada producto de datos y de la fuente de información que lo alimenta. Algunos datos pueden actualizarse mediante procesos periódicos y otros pueden depender de cargas o actualizaciones específicas. Antes de utilizar información para un análisis o decisión, revisa siempre la fecha de actualización y el contexto disponible en el producto o reporte correspondiente.",
      categories: ["Data Marketplace"],
    },
    {
      question: "¿Qué hago si no encuentro la información que necesito?",
      answer:
        "Primero revisa el Data Marketplace y utiliza diferentes términos relacionados con el dato, indicador o área que necesitas. También puedes explorar los productos disponibles para tu unidad de negocio. Si la información todavía no está disponible, contacta al equipo responsable o al soporte de la plataforma indicando qué información necesitas, para qué la utilizarás y qué área o proceso del negocio está relacionado.",
      categories: ["Accesos y permisos"],
    },
  ];

  const categoryNames = [
    "Todas",
    "Accesos y permisos",
    "Data Marketplace",
    "Ingestas de datos",
    "Plataforma",
  ];

  const categories = categoryNames.map((label) => ({
    label,
    count:
      label === "Todas"
        ? faqs.length
        : faqs.filter((faq) => faq.categories.includes(label)).length,
  }));

  const filteredFaqs = useMemo(() => {
    return faqs
      .map((faq, index) => ({
        ...faq,
        originalIndex: index,
      }))
      .filter((faq) => {
        const matchesCategory =
          activeCategory === "Todas" || faq.categories.includes(activeCategory);

        const normalizedSearch = search.toLowerCase().trim();

        const matchesSearch =
          normalizedSearch === "" ||
          faq.question.toLowerCase().includes(normalizedSearch) ||
          faq.answer.toLowerCase().includes(normalizedSearch);

        return matchesCategory && matchesSearch;
      });
  }, [search, activeCategory]);

  const handleToggleFaq = (index: number) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <main className="flex flex-col items-start w-full min-h-full text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <button
            type="button"
            // onClick={() => navigate("/help")}
            className="
              text-[--color-text-secondary]
              pointer-events-none
            "
          >
            Ayuda y documentación
          </button>

          <span className="text-[--color-text-muted]">›</span>

          <span className="font-semibold text-[--color-text-primary]">
            Centro de ayuda
          </span>
        </div>

        {/* Header */}
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
            Plataforma Inteligente de Datos
          </p>
        </section>

        {/* Buscador */}
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
            {/* Search icon */}
            <svg
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
                className="
                  text-[--color-text-secondary]
                  hover:text-[--color-accent]
                  transition-colors
                  px-1
                "
                aria-label="Limpiar búsqueda"
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
                    ${
                      isActive
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
        <section className="w-full mb-10 md:mb-14">
          {filteredFaqs.length > 0 ? (
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
                const isOpen = openFaq === faq.originalIndex;

                return (
                  <div
                    key={faq.originalIndex}
                    className={`
                      w-full
                      ${
                        index !== filteredFaqs.length - 1
                          ? "border-b border-[--color-border]"
                          : ""
                      }
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(faq.originalIndex)}
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
                        ${
                          isOpen
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
                          ${
                            isOpen
                              ? "rotate-0 text-[--color-accent]"
                              : "rotate-180 text-[--color-text-secondary]"
                          }
                        `}
                      />
                    </button>

                    {/* Answer */}
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
          ) : (
            /* Sin resultados */
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
              <h2 className="text-lg md:text-xl font-bold mb-2">
                No encontramos resultados
              </h2>

              <p className="text-sm md:text-base text-[--color-text-secondary]">
                Intenta buscar con otras palabras o selecciona otra categoría.
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer
          className="
            w-full
            border-t
            border-[--color-border]
            py-5
            flex
            flex-col
            md:flex-row
            gap-3
            justify-between
            text-xs
            text-[--color-text-muted]
            uppercase
          "
        >
          <span>
            © 2026 Viña Concha y Toro - Plataforma Inteligente de Datos
          </span>

          <span>
            Impulsando decisiones basadas en datos en toda la organización
          </span>
        </footer>

        <Agent />
      </div>
    </main>
  );
};

export default FaqScreen;
