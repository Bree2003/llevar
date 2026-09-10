import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

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

import SmartToyIcon from "@mui/icons-material/SmartToy";

import { useAppSelector } from "store/hooks/redux-hooks";

import {
  checkDomain,
  checkPermission,
  PermissionList,
} from "modules/tokenPermission/utils/user-token.util";

import { ReportModel, ReportsDataToModel } from "models/Global/reportsModel";

import { DomainModel, DomainsDataToModel } from "models/Global/domainsModel";

import loadReportsData from "services/Global/get-reports-data";
import loadDomainsData from "services/Global/get-domains-data";

interface LateralMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuItemProps {
  label: string;
  icon: any;
  path: string;
  permission: PermissionList;
  onClick: () => void;
}

interface MarketplaceDomain {
  id: string;
  name: string;
  description: string;
  reports: ReportModel[];
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

const getDomainByArea = (domains: DomainModel[], area: string) => {
  return domains.find((domain) => domain.id === area || domain.name === area);
};

const LateralMenu = ({ isOpen, setIsOpen }: LateralMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.UserPermissions);

  const userPermissions = user.permissions;

  const userDomains = user.domains;

  const [reports, setReports] = useState<ReportModel[]>([]);

  const [domains, setDomains] = useState<DomainModel[]>([]);

  const [expandedDomains, setExpandedDomains] = useState<
    Record<string, boolean>
  >({});

  const [isHelpExpanded, setIsHelpExpanded] = useState(() =>
    HELP_ITEMS.some((item) => item.path === location.pathname),
  );

  /*
   * Cargar reportes + dominios desde API.
   */
  useEffect(() => {
    const loadMarketplaceTree = async () => {
      try {
        const [reportsResponse, domainsResponse] = await Promise.all([
          loadReportsData(),
          loadDomainsData(),
        ]);

        setReports(ReportsDataToModel(reportsResponse));

        setDomains(DomainsDataToModel(domainsResponse));
      } catch (error) {
        console.error(
          "Error al cargar datos del Marketplace en menú lateral:",
          error,
        );

        setReports([]);
        setDomains([]);
      }
    };

    loadMarketplaceTree();
  }, []);

  const marketplaceTree = useMemo<MarketplaceDomain[]>(() => {
    return domains
      .filter((domain) => {
        /*
         * Solo dominios activos.
         * Si quieres mostrar también inactivos,
         * elimina esta condición.
         */
        if (!domain.active) {
          return false;
        }

        /*
         * Solo dominios permitidos
         * para el usuario.
         */
        if (!checkDomain(userDomains, domain.id)) {
          return false;
        }

        return true;
      })
      .map((domain) => {
        const domainReports = reports.filter(
          (report) => report.area === domain.id || report.area === domain.name,
        );

        return {
          id: domain.id,
          name: domain.name,
          description: domain.description,
          reports: domainReports,
        };
      })
      .filter((domain) => domain.reports.length > 0);
  }, [reports, domains, userDomains]);

  const menuItems: MenuItemProps[] = [
    {
      label: "Inicio",
      icon: House,
      path: "/",
      permission: "reader",
      onClick: () => navigate("/"),
    },
    {
      label: "Agente Documental",
      icon: SmartToyIcon,
      path: "/docs_agent",
      permission: "reader",
      onClick: () => navigate("/docs_agent"),
    },
    {
      label: "Ingestas",
      icon: Database,
      path: "/dashboard",
      permission: "ingestion-reader",
      onClick: () => navigate("/dashboard"),
    },
    {
      label: "Marketplace",
      icon: Category,
      path: "/marketplace",
      permission: "marketplace-reader",
      onClick: () => navigate("/marketplace"),
    },
    {
      label: "Administración",
      icon: Setting,
      path: "/admin",
      permission: "admin",
      onClick: () => navigate("/admin"),
    },
  ];

  /*
   * Permite que Marketplace siga
   * marcado como activo cuando estamos
   * dentro de un dominio o reporte.
   *
   * Lo mismo para dashboard/admin.
   */
  const isPathActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  /*
   * Determina si estamos dentro
   * de Ayuda y documentación.
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

    window.open(gcpUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <aside
      className={`
        h-full
        flex-shrink-0

        bg-[var(--color-white)]
        text-[var(--color-text-secondary)]

        font-semibold

        border-r
        border-[--color-border]

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
          {menuItems.map(({ label, icon: Icon, onClick, permission, path }) => {
            const isActive = isPathActive(path);

            if (permission && !checkPermission(userPermissions, permission)) {
              return null;
            }

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

          {/* CONSOLA GCP */}
          {checkPermission(userPermissions, "gcp-access") ? (
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

                ${
                  isOpen
                    ? "justify-start gap-3 px-1.5"
                    : "justify-center px-1.5"
                }
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
          ) : null}
        </div>
      </nav>

      {/* AYUDA Y DOCUMENTACIÓN */}
      <div
        className="
    w-full
    border-t
    border-[var(--color-border)]
  "
      >
        {isOpen ? (
          <div className="p-3">
            {/* ITEM PRINCIPAL */}
            <div
              className={`
          w-full
          h-10

          flex
          items-center

          rounded-lg

          transition-colors

          ${
            isHelpActive
              ? "bg-[--color-accent-light] text-[--color-accent]"
              : "text-[--color-text-secondary] hover:bg-[--color-accent-light] hover:text-[--color-accent]"
          }
        `}
            >
              {/* IR A PRIMEROS PASOS */}
              <button
                type="button"
                onClick={() => {
                  setIsHelpExpanded(true);
                  navigate("/onboarding");
                }}
                className="
            flex
            items-center
            gap-3

            flex-1
            min-w-0

            h-full

            px-1.5

            text-left
          "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="
              w-6
              h-6

              flex-shrink-0
            "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 9a3.375 3.375 0 116.75 0c0 2.25-3.375 2.25-3.375 4.5M12 17.25h.008v.008H12v-.008z"
                  />

                  <circle cx="12" cy="12" r="9" />
                </svg>

                <span
                  className="
              text-sm
              font-semibold

              truncate
            "
                >
                  Ayuda y documentación
                </span>
              </button>

              {/* EXPANDIR / CONTRAER */}
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
            w-8
            h-8

            mr-1

            flex
            items-center
            justify-center

            flex-shrink-0

            rounded-md

            hover:bg-white/50

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
            </div>

            {/* SUBMENÚ */}
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
              mt-1

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
                    min-h-9

                    flex
                    items-center

                    px-1.5
                    py-2

                    rounded-lg

                    text-left
                    text-sm

                    transition-colors

                    ${
                      isActive
                        ? "bg-[--color-accent-light] text-[--color-accent] font-semibold"
                        : "text-[--color-text-secondary] hover:bg-[--color-accent-light] hover:text-[--color-accent]"
                    }
                  `}
                      >
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
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
          h-10

          flex
          items-center
          justify-center

          rounded-lg

          transition-colors

          ${
            isHelpActive
              ? "bg-[--color-accent] text-white"
              : "text-[--color-text-secondary] hover:bg-[--color-accent-light] hover:text-[--color-accent]"
          }
        `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="
            w-6
            h-6
          "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9a3.375 3.375 0 116.75 0c0 2.25-3.375 2.25-3.375 4.5M12 17.25h.008v.008H12v-.008z"
                />

                <circle cx="12" cy="12" r="9" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {location.pathname.startsWith("/marketplace") &&
        isOpen &&
        marketplaceTree.length > 0 && (
          <div
            className="
              flex-1
              min-h-0

              text-left

              p-3

              overflow-y-auto

              [&::-webkit-scrollbar]:hidden
            "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
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
                const isDomainActive =
                  location.pathname === `/marketplace/${domain.id}`;

                const isDomainPath = location.pathname.startsWith(
                  `/marketplace/${domain.id}`,
                );

                const isExpanded = expandedDomains[domain.id] ?? isDomainPath;

                return (
                  <div key={domain.id}>
                    {/* DOMINIO */}
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
                            isDomainActive || isDomainPath
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

                    {/* REPORTES */}
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
                                          ? "bg-[--color-accent-light] text-[--color-accent] font-semibold"
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

          bg-white
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
