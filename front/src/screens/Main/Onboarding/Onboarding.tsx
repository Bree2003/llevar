import { useNavigate } from "react-router-dom";

import { ReactComponent as Download } from "components/Global/Icons/download.svg";
import { ReactComponent as ArrowUp } from "components/Global/Icons/arrow-up.svg";

const OnboardingScreen = () => {
  const navigate = useNavigate();

  const PLACEHOLDER_IMAGE = "/images/video-introductorio.png";

  const handleDownloadManual = () => {
    const link = document.createElement("a");

    link.href = "/documents/manual-usuario.pdf";
    link.download = "Manual-Plataforma-Inteligente-de-Datos.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const learning_items = [
    {
      img: "/images/explora-data.png",
      title: "Explora el Data Marketplace",
      description:
        "Descubre cómo encontrar reportes certificados y productos de datos para apoyar la toma de decisiones",
    },
    {
      img: "/images/indicadores.png",
      title: "Comprende los indicadores clave",
      description:
        "Aprende a interpretar métricas, KPIs y conceptos que te ayudarán a entender mejor el desempeño del negocio",
    },
    {
      img: "/images/accesos.png",
      title: "Gestiona accesos y permisos",
      description:
        "Conoce cómo solicitar acceso a información y recursos según tus necesidades",
    },
    {
      img: "/images/administrar.png",
      title: "Administra y actualiza datos",
      description:
        "Aprende a cargar, modificar y mantener información crítica para asegurar datos confiables y actualizados",
    },
  ];

  const content_items = [
    {
      img: PLACEHOLDER_IMAGE,
      title: "Ingesta de tablas",
      description:
        "Aprende a cargar información de forma segura y mantener actualizados los datos utilizados por la organización",
      onClick: () => navigate("/dashboard"),
    },
    {
      img: PLACEHOLDER_IMAGE,
      title: "Crear nueva tabla",
      description:
        "Conoce el proceso para incorporar nuevas fuentes de información y disponibilizarlas para su uso analítico",
      onClick: () => navigate("/dashboard"),
    },
    {
      img: PLACEHOLDER_IMAGE,
      title: "Modificación de tablas manuales",
      description:
        "Aprende a actualizar registros existentes y asegurar la consistencia de la información gestionada",
      onClick: () => navigate("/dashboard"),
    },
    {
      img: PLACEHOLDER_IMAGE,
      title: "Acceder reporte",
      description:
        "Descubre cómo encontrar, visualizar y utilizar reportes certificados para apoyar tus decisiones",
      onClick: () => navigate("/marketplace"),
    },
  ];

  const next_steps = [
    {
      img: "/images/preguntas-frecuentes.png",
      title: "Preguntas frecuentes",
      description:
        "Encuentra respuestas a las consultas más frecuentes sobre el uso de la Plataforma Inteligente de Datos",
      button: "VER FAQS",
      onClick: () => navigate("/faq"),
    },
    {
      img: "/images/diccionario-conceptos.png",
      title: "Diccionarios de conceptos",
      description:
        "Explora los conceptos fundamentales para comprender mejor los datos, indicadores y productos disponibles",
      button: "IR AL DICCIONARIO",
      onClick: () => navigate("/conceptos"),
    },
    {
      img: "/images/manual-usuario.png",
      title: "Manual de usuario",
      description:
        "Accede a la guía completa de uso de la plataforma y sus principales funcionalidades",
      button: "DESCARGAR PDF",
      onClick: handleDownloadManual,
    },
  ];

  return (
    <main className="flex flex-col items-start w-full min-h-full text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button
            type="button"
            // onClick={() => navigate("/help")}
            className="text-[--color-text-secondary] pointer-events-none"
          >
            Ayuda y documentación
          </button>

          <span className="text-[--color-text-muted]">›</span>

          <span className="font-semibold text-[--color-text-primary]">
            Primeros pasos
          </span>
        </div>

        {/* Header */}
        <section className="w-full mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[--color-accent] mb-3">
            Primeros pasos en la Plataforma Inteligente de Datos
          </h1>

          <p className="text-base md:text-lg text-[--color-text-secondary] max-w-5xl">
            Descubre las capacidades de la Plataforma Inteligente de Datos y
            aprende a utilizar información confiable para tomar mejores
            decisiones
          </p>
        </section>

        {/* Introducción */}
        <section className="w-full bg-white border border-[--color-border] rounded-[20px] overflow-hidden mb-8 md:mb-12">
          {/* Hero de introducción */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 p-5 md:p-8 lg:p-10">
            {/* Imagen */}
            <div className="w-full min-h-[220px] md:min-h-[300px] lg:min-h-[340px] bg-[--color-background] rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={PLACEHOLDER_IMAGE}
                alt="Video introductorio"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texto */}
            <div className="flex flex-col justify-center items-start">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Descubre todo el potencial de tus datos
              </h2>

              <p className="text-base md:text-lg text-[--color-text-secondary] mb-6 max-w-xl">
                Esta guía te acompañará en tus primeros pasos para explorar
                información certificada, comprender indicadores clave y
                aprovechar las herramientas disponibles para el análisis y la
                toma de decisiones
              </p>

              <button
                type="button"
                className="
          flex
          items-center
          justify-center
          gap-3
          bg-[--color-accent]
          text-white
          px-6
          py-3
          rounded-[10px]
          uppercase
          text-sm
          font-semibold
          hover:opacity-90
          transition-opacity
        "
              >
                Ver video introductorio
                <img src="/images/play-circle.png" alt="play-circle" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Línea horizontal respetando padding */}
          <div className="px-5 md:px-8 lg:px-10">
            <div className="w-full border-t border-[--color-border]" />
          </div>

          {/* Qué aprenderás */}
          <div className="px-5 pb-5 pt-6 md:px-8 md:pb-8 md:pt-8 lg:px-10 lg:pb-10">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
              ¿Qué aprenderás?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full">
              {learning_items.map((item, index) => (
                <div
                  key={index}
                  className={`
            flex
            gap-4
            py-5

            ${index !== learning_items.length - 1
                      ? "border-b border-[--color-border]"
                      : ""
                    }

            md:px-6

            xl:py-0
            xl:border-b-0

            ${index !== learning_items.length - 1
                      ? "xl:border-r xl:border-[--color-border]"
                      : ""
                    }

            ${index === 0 ? "md:pl-0 xl:pl-0" : ""}

            ${index === learning_items.length - 1 ? "xl:pr-0" : ""}
          `}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-12 h-12 md:w-14 md:h-14 object-contain flex-shrink-0"
                  />

                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm md:text-base text-[--color-text-secondary] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Aprende lo que te interesa */}
        <section className="w-full mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Aprende lo que te interesa
          </h2>

          <p className="text-base md:text-lg text-[--color-text-secondary] mb-8">
            Explora contenidos prácticos para aprender a utilizar la plataforma
            según tus necesidades
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
            {content_items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={item.onClick}
                className="
                  w-full
                  text-left
                  grid
                  grid-cols-1
                  sm:grid-cols-[180px_1fr]
                  md:grid-cols-[220px_1fr]
                  gap-5
                  items-center
                  p-4
                  rounded-2xl
                  hover:bg-white
                  hover:shadow-sm
                  transition-all
                "
              >
                <div className="w-full h-[160px] md:h-[180px] bg-white rounded-xl overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm md:text-base text-[--color-text-secondary]">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Siguientes pasos */}
        <section className="w-full mb-6 md:mb-8">
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
              md:gap-8
              w-full
              bg-white
              rounded-[20px]
              border
              border-[--color-border]
              p-5
              md:p-7
            "
          >
            {next_steps.map((card, index) => (
              <div
                key={index}
                className={`
                  flex
                  flex-col
                  sm:flex-row
                  gap-4
                  md:gap-5
                  w-full
                  ${index !== next_steps.length - 1
                    ? "xl:border-r xl:border-[--color-border] xl:pr-8"
                    : ""
                  }
                `}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain flex-shrink-0"
                  loading="lazy"
                />

                <div className="flex flex-col flex-1">
                  <h3 className="text-lg md:text-xl font-bold pb-2">
                    {card.title}
                  </h3>

                  <p className="text-sm md:text-base text-[--color-text-secondary] pb-4 flex-1">
                    {card.description}
                  </p>

                  <button
                    type="button"
                    onClick={card.onClick}
                    className="text-[--color-accent] flex gap-2 items-center w-fit text-sm"
                  >
                    <strong>{card.button}</strong>

                    {card.button === "DESCARGAR PDF" ? (
                      <Download className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ArrowUp className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Necesitas más ayuda */}
        <section
          className="
            w-full
            bg-blue-50
            border
            border-blue-100
            rounded-[16px]
            px-5
            py-5
            md:px-7
            md:py-6
            mb-8
            flex
            flex-col
            sm:flex-row
            gap-4
            items-start
          "
        >
          <div className="w-10 h-10 rounded-full border border-blue-400 text-blue-500 flex items-center justify-center flex-shrink-0 font-bold">
            ?
          </div>

          <div>
            <h2 className="text-base md:text-lg font-bold mb-2">
              ¿Necesitas más ayuda?
            </h2>

            <p className="text-sm md:text-base text-[--color-text-secondary] mb-2">
              Nuestro equipo está disponible para ayudarte a resolver dudas y
              aprovechar al máximo la Plataforma Inteligente de Datos
            </p>

            <a
              href="mailto:pedir-correo-soporte@conchaytoro.cl"
              className="text-sm md:text-base text-[--color-info] font-semibold hover:underline"
            >
              placeholder@conchaytoro.cl
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OnboardingScreen;
