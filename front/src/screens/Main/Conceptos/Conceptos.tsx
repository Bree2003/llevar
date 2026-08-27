import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Agent from "../../../components/Agent/Agent";

import { ReactComponent as Box } from "components/Global/Icons/box.svg";
import { ReactComponent as Chart } from "components/Global/Icons/chart.svg";
import { ReactComponent as Data } from "components/Global/Icons/data.svg";
import { ReactComponent as ArrowUp } from "components/Global/Icons/arrow-up.svg";

type ConceptCategory =
  | "Datos y modelos"
  | "Indicadores"
  | "Procesos"
  | "Negocio"
  | "Reportes";

interface Concept {
  title: string;
  summary: string;
  description: string;
  categories: ConceptCategory[];
  icon: "data" | "chart" | "box";
}

const concepts: Concept[] = [
  {
    title: "Producto de datos",
    summary:
      "Activo de información preparado para responder a una necesidad específica del negocio.",
    description:
      "Un producto de datos es un activo de información diseñado para resolver una necesidad concreta del negocio utilizando datos confiables, gobernados y preparados para su consumo. Puede estar compuesto por datasets, indicadores, reportes, dashboards u otros recursos que permiten analizar información y tomar decisiones. Dentro de la Plataforma Inteligente de Datos, los productos de datos buscan entregar información con contexto, trazabilidad y criterios de calidad definidos.",
    categories: ["Datos y modelos", "Negocio"],
    icon: "data",
  },
  {
    title: "KPI (Indicador clave de desempeño)",
    summary:
      "Indicador utilizado para medir el desempeño de un proceso, área u objetivo.",
    description:
      "Un KPI o Indicador Clave de Desempeño es una medida utilizada para evaluar el nivel de cumplimiento de un objetivo relevante para el negocio. Permite monitorear resultados, identificar tendencias y comparar el desempeño a lo largo del tiempo. Los KPIs deben estar asociados a una definición clara, una metodología de cálculo y una fuente de datos confiable para asegurar una interpretación consistente dentro de la organización.",
    categories: ["Indicadores"],
    icon: "chart",
  },
  {
    title: "Dataset",
    summary:
      "Conjunto estructurado de datos utilizado como base para análisis y productos de datos.",
    description:
      "Un dataset es un conjunto organizado de datos que reúne información relacionada bajo una estructura definida. Puede contener registros provenientes de distintas fuentes y sirve como base para construir análisis, indicadores, reportes y productos de datos. Dentro de la plataforma, los datasets permiten disponibilizar información de manera controlada y reutilizable, facilitando que diferentes equipos trabajen sobre fuentes consistentes.",
    categories: ["Datos y modelos"],
    icon: "data",
  },
  {
    title: "Última partición",
    summary:
      "Versión más reciente de los datos disponibles dentro de una tabla o producto.",
    description:
      "La última partición corresponde al conjunto de datos más reciente disponible dentro de una tabla particionada. Las particiones permiten organizar grandes volúmenes de información utilizando criterios como fechas, períodos u otras variables. Consultar la última partición ayuda a identificar rápidamente cuál es la versión más actualizada de los datos disponibles para análisis y consumo.",
    categories: ["Datos y modelos", "Procesos"],
    icon: "box",
  },
  {
    title: "Reporte certificado",
    summary:
      "Reporte validado y aprobado para su utilización dentro de la organización.",
    description:
      "Un reporte certificado es un recurso analítico que ha pasado por un proceso de validación para asegurar que utiliza fuentes de información confiables, definiciones consistentes y criterios de negocio acordados. Su certificación permite que los usuarios puedan utilizarlo como una referencia confiable para análisis y toma de decisiones, reduciendo diferencias entre distintas versiones de una misma información.",
    categories: ["Reportes"],
    icon: "box",
  },
  {
    title: "Métrica",
    summary:
      "Valor cuantitativo utilizado para medir un comportamiento, resultado o característica.",
    description:
      "Una métrica es una medida cuantitativa que permite observar y analizar un aspecto específico de un proceso, producto o resultado. Puede utilizarse para realizar seguimiento, comparar períodos o identificar tendencias. A diferencia de un KPI, una métrica no necesariamente está asociada directamente a un objetivo estratégico, aunque puede servir como insumo para construir indicadores de desempeño.",
    categories: ["Indicadores"],
    icon: "chart",
  },
  {
    title: "Indicador",
    summary:
      "Medida que permite interpretar el estado o evolución de un resultado.",
    description:
      "Un indicador representa una medida construida a partir de datos que ayuda a comprender el comportamiento de un proceso, área o resultado de negocio. Permite transformar información en una señal fácil de interpretar y facilita el seguimiento de tendencias, comparaciones y cambios relevantes. Cada indicador debe contar con una definición clara para asegurar que todos los usuarios lo interpreten de la misma manera.",
    categories: ["Indicadores"],
    icon: "chart",
  },
  {
    title: "Dimensión",
    summary:
      "Atributo utilizado para segmentar y analizar información desde distintas perspectivas.",
    description:
      "Una dimensión es una característica que permite organizar, clasificar y segmentar los datos para analizarlos desde diferentes perspectivas. Algunos ejemplos pueden ser período, región, producto, canal, cliente o unidad de negocio. Las dimensiones permiten explorar una misma métrica o indicador con distintos niveles de detalle y comprender mejor qué factores están influyendo en los resultados.",
    categories: ["Indicadores"],
    icon: "chart",
  },
];

const categoryNames = [
  "Todos",
  "Datos y modelos",
  "Indicadores",
  "Procesos",
  "Negocio",
  "Reportes",
];

const ConceptosScreen = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [openConcept, setOpenConcept] = useState<number | null>(null);

  const categories = categoryNames.map((label) => ({
    label,
    count:
      label === "Todos"
        ? concepts.length
        : concepts.filter((concept) =>
            concept.categories.includes(label as ConceptCategory),
          ).length,
  }));

  const filteredConcepts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return concepts
      .map((concept, index) => ({
        ...concept,
        originalIndex: index,
      }))
      .filter((concept) => {
        const matchesCategory =
          activeCategory === "Todos" ||
          concept.categories.includes(activeCategory as ConceptCategory);

        const matchesSearch =
          normalizedSearch === "" ||
          concept.title.toLowerCase().includes(normalizedSearch) ||
          concept.summary.toLowerCase().includes(normalizedSearch) ||
          concept.description.toLowerCase().includes(normalizedSearch);

        return matchesCategory && matchesSearch;
      });
  }, [search, activeCategory]);

  const handleToggleConcept = (index: number) => {
    setOpenConcept((current) => (current === index ? null : index));
  };

  const getConceptIcon = (icon: Concept["icon"]) => {
    switch (icon) {
      case "chart":
        return Chart;

      case "box":
        return Box;

      case "data":
      default:
        return Data;
    }
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
            Diccionario de conceptos
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
            productos de datos disponibles
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
            {/* Search Icon */}
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
              placeholder="Busca un concepto, indicador o término"
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

        {/* Conceptos */}
        <section className="w-full mb-10 md:mb-14">
          {filteredConcepts.length > 0 ? (
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
                const Icon = getConceptIcon(concept.icon);
                const isOpen = openConcept === concept.originalIndex;

                return (
                  <div
                    key={concept.originalIndex}
                    className={`
        w-full
        ${
          index !== filteredConcepts.length - 1
            ? "border-b border-[--color-border]"
            : ""
        }
      `}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleConcept(concept.originalIndex)}
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
          ${
            isOpen
              ? "bg-[--color-accent-light]"
              : "bg-white hover:bg-[--color-background]"
          }
        `}
                    >
                      {/* Icono */}
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
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>

                      {/* Información */}
                      <div className="flex-1 min-w-0">
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
                          {concept.title}
                        </h2>

                        {/* Resumen cuando está cerrado */}
                        {!isOpen && (
                          <p
                            className="
                text-sm
                md:text-base
                text-[--color-text-secondary]
                leading-relaxed
              "
                          >
                            {concept.summary}
                          </p>
                        )}

                        {/* Descripción completa cuando está abierto */}
                        <div
                          className={`
              grid
              transition-all
              duration-300
              ease-in-out
              ${
                isOpen
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
                                {concept.description}
                              </p>

                              {/* Categorías */}
                              <div className="flex flex-wrap gap-2 mt-5">
                                {concept.categories.map((category) => (
                                  <span
                                    key={category}
                                    className="
                        px-3
                        py-1.5
                        rounded-full
                        bg-white
                        border
                        border-[--color-border]
                        text-xs
                        md:text-sm
                        text-[--color-text-secondary]
                      "
                                  >
                                    {category}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flecha */}
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
            ${
              isOpen
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
                No encontramos conceptos
              </h2>

              <p className="text-sm md:text-base text-[--color-text-secondary]">
                Intenta buscar con otro término o selecciona otra categoría.
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
