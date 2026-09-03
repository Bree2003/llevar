import { Link } from "react-router-dom";

type ModuleIconName = "platform" | "marketplace" | "ingesta";

const modules: {
  id: ModuleIconName;
  title: string;
  description: string;
  to: string;
}[] = [
  {
    id: "platform",
    title: "Configuración plataforma",
    description: "Accede a la configuración general de la plataforma.",
    to: "/admin/platform",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description:
      "Agrega, edita, elimina y audita los reportes del marketplace.",
    to: "/admin/marketplace",
  },
  {
    id: "ingesta",
    title: "Ingesta",
    description: "Accede a la administración de la ingesta de datos.",
    to: "/admin/ingesta",
  },
];

function ModuleIcon({ name }: { name: ModuleIconName }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "platform" && (
        <>
          <path d="M4 7h7m4 0h5M4 17h3m4 0h9" />
          <circle cx="13" cy="7" r="2" />
          <circle cx="9" cy="17" r="2" />
        </>
      )}
      {name === "marketplace" && (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      )}
      {name === "ingesta" && (
        <>
          <path d="M12 3v11m-4-4 4 4 4-4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        </>
      )}
    </svg>
  );
}

const AdminScreen = () => (
  <main className="flex min-h-full w-full flex-col items-start py-6 text-left md:py-8">
    <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold text-[--color-accent] md:text-4xl xl:text-5xl">
          Administración
        </h1>
        <p className="mt-4 max-w-4xl text-base font-medium text-[--color-text-secondary] md:mt-6 md:text-lg">
          Gestiona la plataforma, el marketplace y la ingesta de datos desde un
          solo lugar.
        </p>
      </header>

      <nav aria-label="Módulos de administración" className="mt-8 md:mt-10">
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 lg:grid-cols-3 lg:gap-6">
          {modules.map((module) => (
            <li key={module.id} className="flex min-w-0">
              <Link
                to={module.to}
                className="group flex w-full flex-col rounded-xl border border-[--color-border] bg-white p-6 no-underline transition-[border-color,box-shadow] hover:border-[--color-accent] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[--color-accent] motion-reduce:transition-none md:p-8"
              >
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-[10px] bg-[--color-accent-light] text-[--color-accent]">
                  <ModuleIcon name={module.id} />
                </span>

                <h3 className="text-xl font-semibold text-[--color-text-primary]">
                  {module.title}
                </h3>
                <p className="mb-7 mt-3 text-base leading-relaxed text-[--color-text-secondary]">
                  {module.description}
                </p>

                <span className="mt-auto flex items-center justify-between gap-4 border-t border-[--color-border] pt-5 text-sm font-semibold text-[--color-accent]">
                  Acceder al módulo
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </main>
);

export default AdminScreen;
