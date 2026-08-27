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
import { Report } from "screens/Marketplace/Admin/types";
import { useMemo, useState } from "react";
import { domainUnits } from "data/domain-units";

interface LateralMenuProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LateralMenu = ({
    isOpen,
    setIsOpen,
}: LateralMenuProps) => {

    const navigate = useNavigate();
    const location = useLocation();

    const STORAGE_KEY = "admin_reports";

    const [expandedDomains, setExpandedDomains] = useState<
        Record<string, boolean>
    >({});


    const reports: Report[] = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "[]"
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
            {} as Record<string, Report[]>
        );

        return Object.entries(grouped)
            .map(([domainId, reports]) => {
                const domain = domainUnits.find(
                    (unit) => unit.id === domainId
                );

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

    if (location.pathname === "/home") {
        return null;
    }

    const menuItems = [
        {
            label: "Inicio",
            icon: House,
            path: "/home",
            onClick: () => navigate("/home")
        },
        {
            label: "Ingestas",
            icon: Database,
            path: "/dashboard",
            onClick: () => navigate("/dashboard")
        },
        {
            label: "Marketplace",
            icon: Category,
            path: "/marketplace",
            onClick: () => navigate("/marketplace")
        },
        {
            label: "Administración",
            icon: Setting,
            path: "/marketplace/administracion",
            onClick: () => navigate("/marketplace/administracion")
        },
    ];

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
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
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
                flex items-center
                rounded-lg
                transition-colors
                ${isOpen ? "justify-start gap-3 px-1.5" : "px-1.5"}
                ${isActive ? "bg-[--color-accent] text-white" : "hover:bg-[--color-accent-light] hover:text-[--color-accent]"}
                `}
                            >
                                <Icon className="w-6 h-6" />

                                {isOpen && (
                                    <span className="text-sm font-semibold whitespace-nowrap">
                                        {label}
                                    </span>
                                )}

                            </button>

                        )
                    })}

                    <button
                        type="button"
                        onClick={handleGcpConsoleClick}
                        className={`
              w-full
              h-10
              flex items-center
              rounded-lg
              hover:bg-[--color-accent-light]
              hover:text-[--color-accent]
              transition-colors
              ${isOpen ? "justify-start gap-3 px-1.5" : "px-1.5"}
            `}
                    >

                        <Cloud className="w-6 h-6 shrink-0" />

                        {isOpen && (
                            <span className="text-sm whitespace-nowrap">
                                Consola GCP
                            </span>
                        )}

                        {isOpen && <Export className="w-5 h-5 shrink-0" />}
                    </button>
                </div>
            </nav>

            {/* Marketplace Navigation */}
            {location.pathname.startsWith("/marketplace") && isOpen && (
                <div className="text-left p-3">

                    {isOpen && (
                        <h4 className="uppercase text-xs mb-3 text-[--color-text-muted]">
                            Unidades de Negocio
                        </h4>
                    )}

                    <div className="flex flex-col gap-1">

                        {marketplaceTree.map((domain) => {
                            if (!domain) {
                                return null;
                            }

                            const isDomainActive =
                                location.pathname ===
                                `/marketplace/${domain.id}`;

                            return (
                                <div key={domain.id}>

                                    {/* DOMAIN */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/marketplace/${domain.id}`
                                            )
                                        }
                                        className={`
                                w-full
                                flex
                                items-center
                                gap-2
                                py-2
                                px-2
                                rounded-lg
                                text-left
                                transition-colors
                                ${isDomainActive
                                                ? "bg-[--color-accent-light] text-[--color-accent]"
                                                : "hover:bg-[--color-background]"
                                            }
                            `}
                                    >
                                        <ArrowDown className=" w-4 h-4" />
                                        <Folder className="w-5 h-5" />

                                        {isOpen && (
                                            <>
                                                <span className="text-sm">
                                                    {domain.name}
                                                </span>
                                            </>
                                        )}
                                    </button>

                                    {/* REPORTS */}
                                    {isOpen && (
                                        <div className="ml-8 mt-1 flex flex-col gap-1">

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
                                                                `/marketplace/${domain.id}/${report.id}`
                                                            )
                                                        }
                                                        className={`
                                                flex
                                                items-center
                                                gap-2
                                                px-2
                                                py-1
                                                rounded-md
                                                text-left
                                                text-sm
                                                transition-colors
                                                ${isReportActive
                                                                ? "bg-[--color-accent-light] text-[--color-accent]"
                                                                : "hover:bg-[--color-background]"
                                                            }
                                            `}
                                                    >
                                                        <BarChart className="w-4 h-4" />

                                                        <span className="truncate">
                                                            {report.nombre}
                                                        </span>
                                                    </button>
                                                );
                                            })}

                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </div>
            )}

            <div className="border-t border-[var(--color-border)] flex justify-center items-center p-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
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
                        <Close className="w-10 h-10 shrink-0" />
                    ) : (
                        <Menu className="w-6 h-6 shrink-0" />
                    )}
                </button>
            </div>
        </aside>
    );
};

export default LateralMenu;