import { useNavigate } from "react-router-dom";
import Agent from "../../../components/Agent/Agent";
import { ReactComponent as Box } from "components/Global/Icons/box.svg";
import { ReactComponent as Chart } from "components/Global/Icons/chart.svg";
import { ReactComponent as Data } from "components/Global/Icons/data.svg";
import { ReactComponent as ArrowUp } from "components/Global/Icons/arrow-up.svg";

const FaqScreen = () => {
  const navigate = useNavigate();

  // Función para manejar el clic del botón y navegar a la vista de ingesta/exploración.
  const handleExploreClick = () => {
    navigate("/dashboard");
  };
  const handleCuadraturaClick = () => {
    const envSuffix = process.env.REACT_APP_ENVIRONMENT || "dev";
    // El nombre del bucket se construye usando la variable (ej: dev o prd)
    const bucketName = `raw-${envSuffix.toLowerCase()}-osc-manual-bucket`;
    navigate(`/dashboard/pd/${bucketName}/cuadraturas/folders`);
  };

  const handleGcpConsoleClick = () => {
    const envSuffix = process.env.REACT_APP_ENVIRONMENT || "dev";

    const gcpUrl =
      envSuffix === "dev"
        ? "https://console.cloud.google.com/welcome?project=cyt-dev-hq-osc-gcp"
        : "https://console.cloud.google.com/welcome?project=cyt-prd-hq-osc-gcp";

    window.open(gcpUrl, "_blank", "noopener, noreferrer");
  };

  const cards = [
    {
      title: "Gestión de Ingestas",
      description:
        "Carga y administra información proveniente de distintas fuentes de negocio.",
      icon: Box,
      button: "Ir a Ingestas",
      onClick: () => navigate("/dashboard"),
    },
    {
      title: "Data Marketplace",
      description:
        "Accede a dashboards, reportes certificados y activos de datos disponibles.",
      icon: Chart,
      button: "Ver Marketplace",
      onClick: () => navigate("/marketplace"),
    },
    {
      title: "Consola GCP",
      description:
        "Accede a la infraestructura cloud y a los servicios analíticos de la plataforma.",
      icon: Data,
      button: "Acceder Consola",
      onClick: handleGcpConsoleClick,
    },
  ];

  return (
    <main className="flex flex-col items-start w-full h-full bg-gray-50 text-left p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-[--color-accent]">
          Analytics Hub
          <br />
          Plataforma centralizada de datos y analítica
        </h1>

        <p className="mt-6 text-lg font-medium max-w-4xl text-[--color-text-secondary]">
          Centraliza la gestión de datos, accede a reportes certificados y opera la plataforma analítica de Concha y Toro desde un único punto de acceso.
        </p>

        {/* Contenedor de las tarjetas de características */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="
          bg-[var(--color-white)]
          p-6
          rounded-2xl
          border border-[var(--color-border)]
          shadow-sm
          hover:shadow-md
          transition-all
          flex flex-col
          justify-between
        "
              >
                <div className="bg-[--color-background] p-2 rounded-[10px] w-fit">
                  <Icon className="w-8 h-8 text-[var(--color-accent)]" />
                </div>

                <h3 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                  {card.description}
                </p>

                <button
                  onClick={card.onClick}
                  className="
            mt-8
            flex items-center gap-2
            bg-[var(--color-accent)]
            text-white
            px-4
            py-2
            rounded-lg
            font-semibold
            hover:bg-[var(--color-accent-hover)]
            transition-colors
            w-full
            justify-center
            text-sm
            uppercase
          "
                >
                  {card.button}
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
        <Agent />
      </div>
    </main>
  );
};

export default FaqScreen;
