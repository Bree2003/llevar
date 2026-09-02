import { ReactComponent as Menu } from "components/Global/Icons/menu.svg";
import { ReactComponent as Close } from "components/Global/Icons/close.svg";
import { ReactComponent as House } from "components/Global/Icons/house.svg";
import { ReactComponent as Database } from "components/Global/Icons/database.svg";
import { ReactComponent as Category } from "components/Global/Icons/category.svg";
import { ReactComponent as Setting } from "components/Global/Icons/setting.svg";
import { ReactComponent as Cloud } from "components/Global/Icons/cloud.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";
import { ReactComponent as ArrowDown } from "components/Global/Icons/arrow-right.svg";
import { ReactComponent as Folder } from "components/Global/Icons/folder.svg";
import { ReactComponent as BarChart } from "components/Global/Icons/bar-chart.svg";

import { useLocation, useNavigate } from "react-router";
import { useMemo, useState } from "react";

import { Report } from "screens/Marketplace/Admin/types";
import { domainUnits } from "data/domain-units";

interface LateralMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HELP_ITEMS = [
  {
    label: "Primeros pasos",
    path: "/onboarding",
  },
  {
    label: "Centro de ayuda",
    path: "/faq",
  },
  {
    label: "Diccionario de conceptos",
    path: "/conceptos",
  },
];

const LateralMenu = ({ isOpen, setIsOpen }: LateralMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const STORAGE_KEY = "admin_reports";

  const [expandedDomains, setExpandedDomains] = useState<
    Record<string, boolean>
  >({});

  const [isHelpExpanded, setIsHelpExpanded] = useState(() =>
    HELP_ITEMS.some((item) => item.path === location.pathname),
  );

  const reports: Report[] = JSON.parse(
    sessionStorage.getItem(STORAGE_KEY) || "[]",
  );

  const marketplaceTree = useMemo(() => {
    const grouped = reports.reduce(
      (acc, report) => {
        if (!report.area) {
          return acc;
        }

        if (!acc[report.area]) {
          acc[report.area] = [];
        }

        acc[report.area].push(report);

        return acc;
      },
      {} as Record<string, Report[]>,
    );

    return Object.entries(grouped)
      .map(([domainId, reports]) => {
        const domain = domainUnits.find((unit) => unit.id === domainId);

        if (!domain) {
          return null;
        }

        return {
          ...domain,
          reports,
        };
      })
      .filter(Boolean);
  }, [reports]);

  const menuItems = [
    {
      label: "Inicio",
      icon: House,
      path: "/home",
      onClick: () => navigate("/home"),
    },
    {
      label: "Ingestas",
      icon: Database,
      path: "/dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      label: "Marketplace",
      icon: Category,
      path: "/marketplace",
      onClick: () => navigate("/marketplace"),
    },
    {
      label: "Administración",
      icon: Setting,
      path: "/marketplace/administracion",
      onClick: () => navigate("/marketplace/administracion"),
    },
  ];

  /*
   * Determina si estamos dentro de alguna vista
   * perteneciente a Ayuda y documentación.
   */
  const isHelpActive = HELP_ITEMS.some(
    (item) => item.path === location.pathname,
  );

  /*
   * Consola GCP.
   */
  const handleGcpConsoleClick = () => {
    const envSuffix = process.env.REACT_APP_ENVIRONMENT || "dev";

    const gcpUrl =
      envSuffix === "dev"
        ? "https://console.cloud.google.com/welcome?project=cyt-dev-hq-osc-gcp"
        : "https://console.cloud.google.com/welcome?project=cyt-prd-hq-osc-gcp";

    window.open(gcpUrl, "_blank", "noopener, noreferrer");
  };

  return (
    <aside
      className={`
        h-full
        flex-shrink-0

        bg-[var(--color-white)]
        text-[var(--color-text-secondary)]

        font-semibold

        flex
        flex-col

        transition-all
        duration-300
        ease-in-out

        overflow-hidden

        ${isOpen ? "w-[250px]" : "w-[60px]"}
      `}
    >
      <nav className="p-3">
        <div className="flex flex-col">
          {menuItems.map(({ label, icon: Icon, onClick, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={`
                    w-full
                    h-10

                    flex
                    items-center

                    rounded-lg

                    transition-colors

                    ${
                      isOpen
                        ? "justify-start gap-3 px-1.5"
                        : "justify-center px-1.5"
                    }

                    ${
                      isActive
                        ? "bg-[--color-accent] text-white"
                        : "hover:bg-[--color-accent-light] hover:text-[--color-accent]"
                    }
                  `}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />

                {isOpen && (
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {label}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleGcpConsoleClick}
            className={`
              w-full
              h-10

              flex
              items-center

              rounded-lg

              hover:bg-[--color-accent-light]
              hover:text-[--color-accent]

              transition-colors

              ${isOpen ? "justify-start gap-3 px-1.5" : "justify-center px-1.5"}
            `}
          >
            <Cloud className="w-6 h-6 flex-shrink-0" />

            {isOpen && (
              <>
                <span className="text-sm whitespace-nowrap">Consola GCP</span>

                <Export className="w-5 h-5 flex-shrink-0" />
              </>
            )}
          </button>
        </div>
      </nav>

      <div
        className="
          w-full

          border-t
          border-[var(--color-border)]
        "
      >
        {isOpen ? (
          <>
            {/* =============================================
                PADRE
            ============================================== */}

            <div
              className={`
                w-full

                flex
                items-center

                gap-1

                px-3
                py-2

                transition-colors

                ${
                  isHelpActive
                    ? "text-[--color-accent]"
                    : "text-[--color-text-secondary]"
                }
              `}
            >
              {/* Flecha:
                  solamente abre / cierra el submenú */}
              <button
                type="button"
                onClick={() => setIsHelpExpanded((prev) => !prev)}
                aria-label={
                  isHelpExpanded
                    ? "Contraer Ayuda y documentación"
                    : "Expandir Ayuda y documentación"
                }
                aria-expanded={isHelpExpanded}
                className="
                  w-7
                  h-7

                  flex
                  items-center
                  justify-center

                  flex-shrink-0

                  rounded-md

                  hover:bg-[--color-accent-light]

                  transition-colors
                "
              >
                <ArrowDown
                  className={`
                    w-4
                    h-4

                    transition-transform
                    duration-300

                    ${isHelpExpanded ? "rotate-90" : "rotate-0"}
                  `}
                />
              </button>

              {/* Nombre:
                  lleva a Primeros pasos */}
              <button
                type="button"
                onClick={() => {
                  setIsHelpExpanded(true);
                  navigate("/onboarding");
                }}
                className="
                  flex-1
                  min-w-0

                  py-1

                  text-left
                  text-sm
                  font-semibold

                  hover:text-[--color-accent]

                  transition-colors
                "
              >
                <span className="truncate">Ayuda y documentación</span>
              </button>
            </div>

            <div
              className={`
                grid

                transition-all
                duration-300
                ease-in-out

                ${
                  isHelpExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }
              `}
            >
              <div className="overflow-hidden">
                <div
                  className="
                    ml-8
                    mr-3
                    mb-3

                    flex
                    flex-col
                    gap-1
                  "
                >
                  {HELP_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => navigate(item.path)}
                        className={`
                            w-full

                            flex
                            items-center
                            gap-2

                            px-3
                            py-2

                            rounded-md

                            text-left
                            text-sm

                            transition-colors

                            ${
                              isActive
                                ? "bg-[--color-accent-light] text-[--color-accent] font-semibold"
                                : "text-[--color-text-secondary] hover:bg-[--color-background] hover:text-[--color-accent]"
                            }
                          `}
                      >
                        {/* Indicador hijo */}
                        <span
                          className={`
                              w-1.5
                              h-1.5

                              rounded-full

                              flex-shrink-0

                              ${
                                isActive
                                  ? "bg-[--color-accent]"
                                  : "bg-[--color-text-muted]"
                              }
                            `}
                        />

                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          /*
           * Sidebar principal cerrado.
           *
           * Como no existe espacio para el texto,
           * mostramos una pequeña representación
           * visual del grupo.
           */
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsHelpExpanded(true);
            }}
            aria-label="Ayuda y documentación"
            title="Ayuda y documentación"
            className={`
              w-full
              h-14

              flex
              items-center
              justify-center

              transition-colors

              ${
                isHelpActive
                  ? "bg-[--color-accent-light] text-[--color-accent]"
                  : "hover:bg-[--color-accent-light] hover:text-[--color-accent]"
              }
            `}
          >
            {/* Icono simple de ayuda */}
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 9a3.375 3.375 0 116.75 0c0 2.25-3.375 2.25-3.375 4.5M12 17.25h.008v.008H12v-.008z"
              />

              <circle cx="12" cy="12" r="9" />
            </svg>
          </button>
        )}
      </div>

      {location.pathname.startsWith("/marketplace") &&
        isOpen &&
        marketplaceTree.length > 0 && (
          <div className="text-left p-3">
            <h4
              className="
                uppercase
                text-xs
                mb-3

                text-[--color-text-muted]
              "
            >
              Unidades de Negocio
            </h4>

            <div className="flex flex-col gap-1">
              {marketplaceTree.map((domain) => {
                if (!domain) {
                  return null;
                }

                const isDomainActive =
                  location.pathname === `/marketplace/${domain.id}`;

                const isExpanded = expandedDomains[domain.id] ?? false;

                return (
                  <div key={domain.id}>
                    <div
                      className={`
                          w-full

                          flex
                          items-center

                          gap-1

                          py-1
                          px-1

                          rounded-lg

                          transition-colors

                          ${
                            isDomainActive
                              ? "bg-[--color-accent-light] text-[--color-accent]"
                              : "hover:bg-[--color-background]"
                          }
                        `}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDomains((prev) => ({
                            ...prev,

                            [domain.id]: !isExpanded,
                          }))
                        }
                        className="
                            w-7
                            h-7

                            flex
                            items-center
                            justify-center

                            rounded-md

                            flex-shrink-0

                            hover:bg-[--color-accent-light]

                            transition-colors
                          "
                        aria-label={
                          isExpanded
                            ? `Contraer ${domain.name}`
                            : `Expandir ${domain.name}`
                        }
                        aria-expanded={isExpanded}
                      >
                        <ArrowDown
                          className={`
                              w-4
                              h-4

                              transition-transform
                              duration-300

                              ${isExpanded ? "rotate-90" : "rotate-0"}
                            `}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/marketplace/${domain.id}`)}
                        className="
                            flex
                            items-center

                            gap-2

                            flex-1
                            min-w-0

                            py-1

                            text-left
                          "
                      >
                        <Folder className="w-5 h-5 flex-shrink-0" />

                        <span className="text-sm truncate">{domain.name}</span>
                      </button>
                    </div>

                    <div
                      className={`
                          grid

                          transition-all
                          duration-300
                          ease-in-out

                          ${
                            isExpanded
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }
                        `}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="
                              ml-8
                              mt-1

                              flex
                              flex-col
                              gap-1
                            "
                        >
                          {domain.reports.map((report) => {
                            const isReportActive =
                              location.pathname ===
                              `/marketplace/${domain.id}/${report.id}`;

                            return (
                              <button
                                key={report.id}
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/marketplace/${domain.id}/${report.id}`,
                                  )
                                }
                                className={`
                                      flex
                                      items-center

                                      gap-2

                                      px-2
                                      py-1.5

                                      rounded-md

                                      text-left
                                      text-sm

                                      transition-colors

                                      ${
                                        isReportActive
                                          ? "bg-[--color-accent-light] text-[--color-accent]"
                                          : "hover:bg-[--color-background]"
                                      }
                                    `}
                              >
                                <BarChart className="w-4 h-4 flex-shrink-0" />

                                <span className="truncate">
                                  {report.nombre}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      <div
        className="
          mt-auto

          w-full

          border-t
          border-[var(--color-border)]

          flex
          justify-center
          items-center

          p-2
        "
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          className="
            w-10
            h-10

            flex
            items-center
            justify-center

            rounded-lg

            hover:bg-[--color-accent-light]
            hover:text-[--color-accent]

            transition-colors
          "
        >
          {isOpen ? (
            <Close className="w-10 h-10 flex-shrink-0" />
          ) : (
            <Menu className="w-6 h-6 flex-shrink-0" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default LateralMenu;
