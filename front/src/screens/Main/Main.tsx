import { useNavigate } from "react-router-dom";
import Agent from "../../components/Agent/Agent";
import { ReactComponent as Download } from "components/Global/Icons/download.svg";
import { ReactComponent as ArrowUp } from "components/Global/Icons/arrow-up.svg";
import BannerCarousel from "components/BannerCarousel/BannerCarousel";

const MainScreen = () => {
  const navigate = useNavigate();

  const handleGcpConsoleClick = () => {
    const envSuffix = process.env.REACT_APP_ENVIRONMENT || "dev";

    const gcpUrl =
      envSuffix === "dev"
        ? "https://console.cloud.google.com/welcome?project=cyt-dev-hq-osc-gcp"
        : "https://console.cloud.google.com/welcome?project=cyt-prd-hq-osc-gcp";

    window.open(gcpUrl, "_blank", "noopener, noreferrer");
  };

  const next_steps = [
    {
      img: "/images/primeros-pasos.png",
      title: "Primeros pasos",
      description:
        "Aprende a utilizar las principales capacidades de la Plataforma Inteligente de Datos y comienza a generar valor desde el primer día",
      button: "VER GUÍA",
      onClick: () => navigate("/onboarding"),
    },
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
      onClick: handleGcpConsoleClick,
    },
  ];

  const banner_images = [
    "/images/banner-marketplace.png",
    "/images/banner-ingesta.png",
    "/images/banner-cloud.png",
    "/images/banner-ia.png",
  ];

  const card_subhero = [
    { img: "/images/card_database.png", title: "Decisiones basadas en datos", description: "Accede a información confiable y actualizada para actuar con mayor rapidez, confianza y contexto" },
    { img: "/images/card_value.png", title: "Valor en un solo lugar", description: "Centraliza reportes, productos de datos y procesos clave en una experiencia unificada para el negocio" },
    { img: "/images/card_eficiency.png", title: "Eficiencia operacional", description: "Reduce esfuerzos manuales y acelera procesos mediante herramientas diseñadas para simplificar el trabajo diario" },
    { img: "/images/card_trust.png", title: "Confianza y gobierno", description: "Trabaja sobre información certificada, trazable y alineada con los estándares de la organización" },
  ];

  return (
    <main className="flex flex-col items-start w-full h-full text-left py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Banner */}
        <BannerCarousel images={banner_images} />
        {/* Hero */}
        <section className="w-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center">
            <div className="flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl pb-4">
                <strong>Hola, Brisa 👋</strong>
              </h2>
              <h1 className="text-4xl md:text-4xl xl:text-6xl leading-tight pb-6">
                <strong>
                  Convierte datos en{" "}
                  <span className="text-[--color-accent]">decisiones</span>{" "}
                  que generan{" "}
                  <span className="text-[--color-accent]">impacto</span>
                </strong>
              </h1>
              <p className="text-lg md:text-xl pb-4">
                <strong>Impulsando una organización Insight-Driven</strong>
              </p>
              <p className="text-base md:text-lg text-[--color-text-secondary] max-w-2xl">
                La Plataforma Inteligente de Datos centraliza información confiable,
                acelera la toma de decisiones, mejora la eficiencia operacional y
                habilita el autoservicio analítico en toda la organización.
                Próximamente potenciada con Inteligencia Artificial.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/images/home-graphic.png" alt="home-graphic" className="w-full max-w-[450px] lg:max-w-[550px] xl:max-w-[700px] h-auto object-contain" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Sub-Hero */}
        <section className="w-full py-12 md:py-16">
          <h2 className="text-2xl pb-8 md:pb-12 text-center lg:text-left">
            <strong>¿Qué encontrarás en tu plataforma inteligente de datos?</strong>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            {card_subhero.map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-5 items-center sm:items-start lg:items-center text-center sm:text-left lg:text-center"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-16 h-16 object-contain flex-shrink-0"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-xl pb-2">
                    <strong>{card.title}</strong>
                  </h3>
                  <p className="text-[--color-text-secondary]">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Capacities */}
        <div className="w-full py-5">
          <h2 className="text-2xl pb-12"><strong>Explora las capacidades de la plataforma</strong></h2>
          <div className="flex w-full gap-5">
            {/* Gestión de datos */}
            <div className="border-2 rounded-xl p-5 border-[--color-border] bg-white">
              <div className="flex w-full gap-4 items-center mb-4">
                <img src="/images/capacities-gestion.png" alt="Gestión de datos" className="h-10" />
                <h2 className="text-2xl"><strong>Gestión de datos</strong></h2>
                <hr className="border-2 border-[--color-accent] flex-1" />
              </div>
              <div className="flex w-full gap-4">
                {/* Ingesta de datos */}
                <div className="flex flex-col border rounded-xl border-[--color-border] p-5 w-96 h-[557px]">
                  <img src="/images/ingesta-datos.png" alt="Ingesta de datos" className="h-60 mb-2" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl pb-2"><strong>Ingesta de datos</strong></h3>
                      <p className="text-[--color-text-secondary]">Incorpora y actualiza información crítica del negocio de manera simple y controlada para mantener la operación siempre conectada con datos confiables</p>
                    </div>
                    <div>
                      <div className="flex gap-4 my-4 items-center bg-[--color-background] rounded-full px-[10px] py-[6px]">
                        <img src="/images/profile.png" alt="Personas" className="h-5" />
                        <span className="text-[--color-text-secondary]">Para quienes construyen y mantienen productos de datos</span>
                      </div>
                      <button type="button" onClick={() => navigate("/dashboard")} className="flex gap-4 bg-[--color-accent] rounded-[10px] px-5 py-[10px] items-center justify-center w-full">
                        <p className="uppercase text-white"><strong>Ir a ingestas</strong></p>
                        <ArrowUp className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Administración de plataforma */}
                <div className="flex flex-col border rounded-xl border-[--color-border] p-5 w-96 h-[557px]">
                  <img src="/images/admin-platform.png" alt="Administración de plataforma" className="h-60 mb-2" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl pb-2"><strong>Administración de plataforma</strong></h3>
                      <p className="text-[--color-text-secondary]">Accede a los servicios que habilitan la operación de la Plataforma Inteligente de Datos y gestiona sus componentes tecnológicos</p>
                    </div>
                    <div>
                      <div className="flex gap-4 my-4 items-center bg-[--color-background] rounded-full px-[10px] py-[6px]">
                        <img src="/images/profile.png" alt="Personas" className="h-5" />
                        <span className="text-[--color-text-secondary]">Para equipos de datos y administración de plataforma</span>
                      </div>
                      <button type="button" onClick={() => handleGcpConsoleClick} className="flex gap-4 bg-[--color-accent] rounded-[10px] px-5 py-[10px] items-center justify-center w-full">
                        <p className="uppercase text-white"><strong>Acceder consola</strong></p>
                        <ArrowUp className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Explotación de datos */}
            <div className="border-2 rounded-xl p-5 border-[--color-border] bg-white">
              <div className="flex w-full gap-4 items-center mb-4">
                <img src="/images/capacities-gestion.png" alt="Gestión de datos" className="h-10" />
                <h2 className="text-2xl"><strong>Explotación de datos</strong></h2>
                <hr className="border-2 border-[--color-accent] flex-1" />
              </div>
              <div className="flex w-full">
                {/* Data Marketplace */}
                <div className="flex flex-col border rounded-xl border-[--color-border] p-5 w-96 h-[557px]">
                  <img src="/images/ingesta-datos.png" alt="Ingesta de datos" className="h-60 mb-2" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl pb-2"><strong>Data Marketplace</strong></h3>
                      <p className="text-[--color-text-secondary]">Tu puerta de entrada a información certificada, insights relevantes y decisiones basadas en datos</p>
                    </div>
                    <div>
                      <div className="flex gap-4 my-4 items-center bg-[--color-background] rounded-full px-[10px] py-[6px]">
                        <img src="/images/profile.png" alt="Personas" className="h-5" />
                        <span className="text-[--color-text-secondary]">Para quienes exploran información, analizan resultados y toman decisiones</span>
                      </div>
                      <button type="button" onClick={() => navigate("/marketplace")} className="flex gap-4 bg-[--color-accent] rounded-[10px] px-5 py-[10px] items-center justify-center w-full">
                        <p className="uppercase text-white"><strong>Acceder marketplace</strong></p>
                        <ArrowUp className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Siguientes pasos */}
        <div className="w-full py-5">
          <h2 className="text-2xl pb-4"><strong>Te acompañamos en cada paso</strong></h2>
          <p className="text-xl pb-12 text-[--color-text-secondary]">Accede a guías, recursos y conocimientos que te ayudarán a aprovechar al máximo la Plataforma Inteligente de Datos</p>
          <div className="flex w-full justify-between gap-4">
            {next_steps.map((card, index) => (
              <div key={index} className="flex justify-between gap-4">
                <img src={card.img} alt={card.img} className="w-16 h-16" />
                <div>
                  <h3 className="text-xl pb-2"><strong>{card.title}</strong></h3>
                  <p className="text-[--color-text-secondary] pb-2">{card.description}</p>
                  <button type="button" onClick={card.onClick} className="text-[--color-accent] flex gap-2 items-center">
                    <strong>{card.title}</strong>
                    {card.img == "/images/manual-usuario.png" ? <Download className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Agent />
      </div>
    </main>
  );
};

export default MainScreen;
