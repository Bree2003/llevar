import { Link } from "react-router-dom";

type ModuleIconName = "platform" | "marketplace";

interface AdminModule {
  id: ModuleIconName;
  eyebrow: string;
  title: string;
  description: string;
  helper: string;
  to: string;
}

const modules: AdminModule[] = [
  {
    id: "platform",
    eyebrow: "Configuración y gobierno",
    title: "Configuración de plataforma",
    description:
      "Administra los componentes que definen cómo opera la Plataforma Inteligente de Datos.",
    helper:
      "Gestiona usuarios, permisos, dominios, preguntas frecuentes y conceptos disponibles para la organización.",
    to: "/admin/platform",
  },
  {
    id: "marketplace",
    eyebrow: "Contenido y explotación",
    title: "Administración del Marketplace",
    description:
      "Mantén actualizada la experiencia de consulta y acceso a reportes certificados.",
    helper:
      "Crea, edita y elimina reportes, define su unidad de negocio, KPIs y contenido de visualización.",
    to: "/admin/marketplace",
  },
];

function ModuleIcon({ name }: { name: ModuleIconName }) {
  return (
    <svg
      width="30"
      height="30"
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
    </svg>
  );
}

const AdminScreen = () => {
  return (
    <main
      className="
        flex
        min-h-full
        w-full
        flex-col
        items-start

        bg-[--color-background]

        py-6
        md:py-8

        text-left
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1600px]

          px-4
          md:px-6
          lg:px-8
        "
      >
        {/* HEADER */}
        <header className="max-w-5xl">
          <p
            className="
              mb-2

              text-xs
              md:text-sm

              font-semibold
              uppercase
              tracking-[0.12em]

              text-[--color-text-muted]
            "
          >
            Administración de plataforma
          </p>

          <h1
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl

              font-bold

              text-[--color-accent]
            "
          >
            Gestiona la operación de la plataforma
          </h1>

          <p
            className="
              mt-4
              md:mt-6

              max-w-4xl

              text-base
              md:text-lg

              font-medium
              leading-relaxed

              text-[--color-text-secondary]
            "
          >
            Desde este espacio puedes configurar cómo funciona la Plataforma
            Inteligente de Datos y mantener actualizada la información que los
            usuarios encuentran y utilizan para tomar decisiones.
          </p>
        </header>

        {/* CONTEXTO */}
        <section
          className="
            mt-8
            md:mt-10

            w-full

            rounded-2xl

            border
            border-[--color-border]

            bg-white

            px-5
            py-5

            md:px-6
            md:py-6

            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col

              gap-4

              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  md:text-xl

                  font-semibold

                  text-[--color-text-primary]
                "
              >
                ¿Qué necesitas administrar?
              </h2>

              <p
                className="
                  mt-1

                  max-w-3xl

                  text-sm
                  md:text-base

                  leading-relaxed

                  text-[--color-text-secondary]
                "
              >
                Selecciona el módulo según si necesitas cambiar la configuración
                general de la plataforma o administrar el contenido disponible
                en el Marketplace.
              </p>
            </div>

            <div
              className="
                flex-shrink-0

                rounded-[10px]

                bg-[--color-accent-light]

                px-4
                py-2

                text-sm
                font-semibold

                text-[--color-accent]
              "
            >
              Consola de administración
            </div>
          </div>
        </section>

        {/* MODULOS */}
        <nav
          aria-label="Módulos de administración"
          className="
            mt-6
            md:mt-8
          "
        >
          <ul
            className="
              m-0

              grid
              list-none
              grid-cols-1

              gap-5

              p-0

              lg:grid-cols-2
              lg:gap-6
            "
          >
            {modules.map((module) => (
              <li
                key={module.id}
                className="
                  flex
                  min-w-0
                "
              >
                <Link
                  to={module.to}
                  className="
                    group

                    flex
                    w-full
                    min-h-[330px]
                    flex-col

                    rounded-2xl

                    border
                    border-[--color-border]

                    bg-white

                    p-6
                    md:p-7
                    lg:p-8

                    no-underline

                    shadow-sm

                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:border-[--color-accent]
                    hover:shadow-md

                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-[--color-accent]

                    motion-reduce:transform-none
                    motion-reduce:transition-none
                  "
                >
                  {/* ICONO + CATEGORÍA */}
                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-4
                    "
                  >
                    <span
                      className="
                        flex
                        h-14
                        w-14
                        flex-shrink-0
                        items-center
                        justify-center

                        rounded-[12px]

                        bg-[--color-accent-light]

                        text-[--color-accent]
                      "
                    >
                      <ModuleIcon name={module.id} />
                    </span>

                    <span
                      className="
                        rounded-md

                        bg-[--color-background]

                        px-3
                        py-2

                        text-[10px]
                        sm:text-xs

                        font-semibold
                        uppercase
                        tracking-wide

                        text-[--color-text-muted]
                      "
                    >
                      {module.eyebrow}
                    </span>
                  </div>

                  {/* CONTENIDO */}
                  <div className="mt-6">
                    <h3
                      className="
                        text-xl
                        md:text-2xl

                        font-bold

                        text-[--color-text-primary]
                      "
                    >
                      {module.title}
                    </h3>

                    <p
                      className="
                        mt-3

                        text-base

                        font-medium
                        leading-relaxed

                        text-[--color-text-secondary]
                      "
                    >
                      {module.description}
                    </p>

                    <p
                      className="
                        mt-4

                        text-sm
                        leading-relaxed

                        text-[--color-text-muted]
                      "
                    >
                      {module.helper}
                    </p>
                  </div>

                  {/* CTA */}
                  <span
                    className="
                      mt-auto

                      flex
                      items-center
                      justify-between

                      gap-4

                      border-t
                      border-[--color-border]

                      pt-5

                      text-sm
                      font-semibold

                      text-[--color-accent]
                    "
                  >
                    <span>Acceder al módulo</span>

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
                      className="
                        transition-transform

                        group-hover:translate-x-1

                        motion-reduce:transform-none
                        motion-reduce:transition-none
                      "
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
};

export default AdminScreen;
