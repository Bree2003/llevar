import { ReactComponent as FilterAdd } from "components/Global/Icons/filter-add.svg";
import { ReactComponent as FilterRemove } from "components/Global/Icons/filter-remove.svg";
import { ReactComponent as Add } from "components/Global/Icons/add.svg";
import { useEffect, useRef, useState } from "react";

import { domainUnits } from "data/domain-units";

import ReportDrawer from "./ReportDrawer";
import ReportsTable from "./ReportsTable";
import { Report } from "./types";

const STORAGE_KEY = "admin_reports";

const getDomainUnitId = (area: string) => {
  const domainUnit = domainUnits.find(
    (unit) => unit.id === area || unit.name === area,
  );

  return domainUnit?.id ?? area;
};

const normalizeReports = (reports: Report[]) => {
  return reports.map((report) => ({
    ...report,
    area: getDomainUnitId(report.area),
  }));
};

const AdminScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [areaFilter, setAreaFilter] = useState("");

  const [sortBy, setSortBy] = useState<
    "recent" | "oldest" | "name-asc" | "name-desc"
  >("recent");

  const filterRef = useRef<HTMLDivElement>(null);

  const handleNewReport = () => {
    setShowFilters(false);
    setSelectedReport(null);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    const storedReports: Report[] = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY) || "[]",
    );

    const normalizedReports = normalizeReports(storedReports);

    setReports(normalizedReports);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedReports));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSaveReport = (report: Report) => {
    const reportToSave = {
      ...report,
      area: getDomainUnitId(report.area),
    };

    const exists = reports.some(
      (currentReport) => currentReport.id === reportToSave.id,
    );

    const updatedReports = exists
      ? reports.map((currentReport) =>
          currentReport.id === reportToSave.id ? reportToSave : currentReport,
        )
      : [...reports, reportToSave];

    setReports(updatedReports);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id);

    setReports(updatedReports);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  };

  const handleEditReport = (report: Report) => {
    setShowFilters(false);
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedReport(null);
    setIsDrawerOpen(false);
  };

  const filteredReports = [...reports]
    .filter((report) => (areaFilter ? report.area === areaFilter : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.fechaModificacion.localeCompare(b.fechaModificacion);

        case "name-asc":
          return a.nombre.localeCompare(b.nombre);

        case "name-desc":
          return b.nombre.localeCompare(a.nombre);

        case "recent":
        default:
          return b.fechaModificacion.localeCompare(a.fechaModificacion);
      }
    });

  const hasFilters = areaFilter !== "" || sortBy !== "recent";

  return (
    <main className="flex flex-col items-start w-full min-h-full bg-gray-50 text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <section className="w-full">
          <h1
            className="
            text-3xl
            md:text-4xl
            xl:text-5xl
            font-bold
            text-[--color-accent]
          "
          >
            Gestión de Reportes
          </h1>

          {/* Descripción + acciones */}
          <div
            className="
            mt-4
            md:mt-6
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-5
            lg:gap-8
          "
          >
            <p
              className="
              text-base
              md:text-lg
              font-medium
              max-w-4xl
              text-[--color-text-secondary]
            "
            >
              Aquí puedes agregar, editar, eliminar y auditar los reportes
              agregados.
            </p>

            {/* Acciones */}
            <div
              className="
              flex
              flex-col
              sm:flex-row
              gap-3
              w-full
              lg:w-auto
              flex-shrink-0
            "
            >
              {/* Filtros */}
              <div
                ref={filterRef}
                className="
                relative
                w-full
                sm:w-auto
              "
              >
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`
                  w-full
                  sm:w-auto
                  flex
                  items-center
                  justify-center
                  py-[10px]
                  px-4
                  gap-3
                  font-medium
                  border
                  rounded-[10px]
                  h-fit
                  transition-colors
                  ${
                    hasFilters
                      ? "bg-[--color-accent-light] text-[--color-accent] border-[--color-accent]"
                      : "bg-white text-[--color-text-secondary] border-[--color-border]"
                  }
                `}
                >
                  {showFilters ? <FilterRemove /> : <FilterAdd />}

                  <span className="whitespace-nowrap">
                    {showFilters ? "Cerrar Filtros" : "Añadir Filtro"}
                  </span>
                </button>

                {/* Dropdown filtros */}
                {showFilters && (
                  <div
                    className="
                    absolute
                    top-[calc(100%+8px)]
                    left-0
                    right-0

                    sm:left-auto
                    sm:right-0
                    sm:w-[320px]

                    z-40

                    bg-white
                    rounded-xl
                    border
                    border-[--color-border]
                    shadow-xl
                    p-4
                  "
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold text-[--color-text-primary]">
                        Filtros
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Área */}
                      <div>
                        <label
                          htmlFor="area-filter"
                          className="
                          block
                          text-xs
                          uppercase
                          font-semibold
                          text-[--color-text-muted]
                          mb-2
                        "
                        >
                          Área
                        </label>

                        <select
                          id="area-filter"
                          name="areaFilter"
                          value={areaFilter}
                          onChange={(event) =>
                            setAreaFilter(event.target.value)
                          }
                          className="
                          w-full
                          border
                          border-[--color-border]
                          rounded-lg
                          p-2.5
                          bg-white
                          outline-none
                          focus:border-[--color-accent]
                        "
                        >
                          <option value="">Todas las áreas</option>

                          {domainUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Orden */}
                      <div>
                        <label
                          htmlFor="sort-by"
                          className="
                          block
                          text-xs
                          uppercase
                          font-semibold
                          text-[--color-text-muted]
                          mb-2
                        "
                        >
                          Ordenar por
                        </label>

                        <select
                          id="sort-by"
                          value={sortBy}
                          onChange={(event) =>
                            setSortBy(event.target.value as typeof sortBy)
                          }
                          className="
                          w-full
                          border
                          border-[--color-border]
                          rounded-lg
                          p-2.5
                          bg-white
                          outline-none
                          focus:border-[--color-accent]
                        "
                        >
                          <option value="recent">Más recientes</option>

                          <option value="oldest">Más antiguos</option>

                          <option value="name-asc">Nombre A-Z</option>

                          <option value="name-desc">Nombre Z-A</option>
                        </select>
                      </div>

                      {/* Limpiar */}
                      <button
                        type="button"
                        onClick={() => {
                          setAreaFilter("");
                          setSortBy("recent");
                          setShowFilters(false);
                        }}
                        className="
                        w-full
                        py-2.5
                        px-4
                        rounded-lg
                        bg-[--color-background]
                        text-[--color-text-secondary]
                        font-medium
                        hover:bg-[--color-accent-light]
                        hover:text-[--color-accent]
                        transition-colors
                      "
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nuevo Reporte */}
              <button
                type="button"
                onClick={handleNewReport}
                className="
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
                py-[10px]
                px-4
                gap-3
                font-medium
                text-white
                bg-[--color-accent]
                h-fit
                rounded-[10px]
                hover:opacity-90
                transition-opacity
                whitespace-nowrap
              "
              >
                <Add />
                Nuevo Reporte
              </button>
            </div>
          </div>
        </section>

        {/* Tabla */}
        <section className="w-full mt-6 md:mt-8">
          <div className="w-full overflow-x-auto">
            <ReportsTable
              reports={filteredReports}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
            />
          </div>
        </section>
      </div>

      <ReportDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveReport}
        report={selectedReport}
      />
    </main>
  );
};

export default AdminScreen;
