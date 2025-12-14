import { useState, useEffect, useRef, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// --- TIPOS ---
interface FileData {
  fileName?: string;
  headers?: string[];
  rows?: Record<string, any>[];
  isEmpty?: boolean;
}

interface Breadcrumbs {
  envId?: string;
  bucketName?: string;
  productName?: string;
  tableName?: string;
}

interface DataGridPreviewProps {
  loading?: boolean;
  file?: FileData;
  breadcrumbs?: Breadcrumbs;
  onSave?: (newRows: any[]) => void;
}

// --- COMPONENTE INTERNO: MODAL DE CONFIRMACIÓN ---
const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-100 transform transition-all scale-100">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
          >
            Sí, descartar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function DataGridEditor({
  loading,
  file,
  breadcrumbs,
  onSave,
}: DataGridPreviewProps) {
  const headers = file?.headers || [];

  // --- ESTADOS DE DATOS ---
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [originalRows, setOriginalRows] = useState<Record<string, any>[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // --- ESTADOS DE UI/FILTROS ---
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
  const [filterSearchTerm, setFilterSearchTerm] = useState("");

  // Selectores UI
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const [isPageSizeSelectorOpen, setIsPageSizeSelectorOpen] = useState(false); // NUEVO

  // --- ESTADOS DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // NUEVO: Estado en vez de constante

  // --- ESTADOS DE EDICIÓN Y SELECCIÓN ---
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(
    new Set()
  );
  const [editingRowIndices, setEditingRowIndices] = useState<Set<number>>(
    new Set()
  );
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Refs
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  const pageSizeSelectorRef = useRef<HTMLDivElement>(null); // NUEVO
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // --- 1. INICIALIZACIÓN ---
  useEffect(() => {
    if (file?.rows && headers.length > 0) {
      setRows(file.rows);
      setOriginalRows(JSON.parse(JSON.stringify(file.rows)));
      setVisibleColumns(headers);
      setActiveFilters({});
      setIsDirty(false);
      setSelectedRowIndices(new Set());
      setEditingRowIndices(new Set());
      setCurrentPage(1);
    }
  }, [file]);

  // --- 2. HELPERS DE SELECCIÓN ---
  const toggleRowSelection = (rowIdx: number) => {
    setSelectedRowIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIdx)) newSet.delete(rowIdx);
      else newSet.add(rowIdx);
      return newSet;
    });
  };

  const toggleSelectAll = (filteredIndices: number[]) => {
    setSelectedRowIndices((prev) => {
      const allVisibleSelected = filteredIndices.every((idx) => prev.has(idx));
      const newSet = new Set(prev);
      if (allVisibleSelected) {
        filteredIndices.forEach((idx) => newSet.delete(idx));
      } else {
        filteredIndices.forEach((idx) => newSet.add(idx));
      }
      return newSet;
    });
  };

  // --- 3. LÓGICA DE EDICIÓN (CRUD) ---
  const handleEditSelected = () => {
    setEditingRowIndices((prev) => {
      const newSet = new Set(prev);
      selectedRowIndices.forEach((idx) => newSet.add(idx));
      return newSet;
    });
  };

  const handleInputChange = (rowIdx: number, col: string, newValue: string) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIdx] = { ...newRows[rowIdx], [col]: newValue };
      return newRows;
    });
    setIsDirty(true);
  };

  const handleAddRow = () => {
    const newRow: Record<string, any> = {};
    headers.forEach((h) => (newRow[h] = ""));
    setRows((prev) => [newRow, ...prev]);
    setIsDirty(true);
    setCurrentPage(1);

    setSelectedRowIndices(new Set([0]));
    setEditingRowIndices((prev) => {
      const newSet = new Set<number>();
      newSet.add(0);
      prev.forEach((idx) => newSet.add(idx + 1));
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedRowIndices.size === 0) return;
    const newRows = rows.filter((_, index) => !selectedRowIndices.has(index));
    setRows(newRows);
    setSelectedRowIndices(new Set());
    setEditingRowIndices(new Set());
    setIsDirty(true);
    setCurrentPage(1);
  };

  const handleSave = () => {
    console.log("Enviando al Backend:", rows);
    if (onSave) onSave(rows);
    setOriginalRows(JSON.parse(JSON.stringify(rows)));
    setIsDirty(false);
    setEditingRowIndices(new Set());
    setSelectedRowIndices(new Set());
  };

  const handleDiscardClick = () => setShowDiscardModal(true);

  const confirmDiscard = () => {
    setRows(JSON.parse(JSON.stringify(originalRows)));
    setIsDirty(false);
    setSelectedRowIndices(new Set());
    setEditingRowIndices(new Set());
    setShowDiscardModal(false);
    setCurrentPage(1);
  };

  // --- 4. LÓGICA DE FILTRADO ---
  const getUniqueValues = (col: string) => {
    const values = Array.from(
      new Set(
        rows.map((row) =>
          row[col] !== null && row[col] !== undefined
            ? String(row[col])
            : "(Vacío)"
        )
      )
    );
    return values.sort();
  };

  const filteredRowsWithIndex = useMemo(() => {
    return rows
      .map((row, idx) => ({ data: row, originalIndex: idx }))
      .filter(({ data: row }) => {
        return Object.entries(activeFilters).every(([col, selectedValues]) => {
          if (selectedValues.length === 0) return false;
          const rowValue =
            row[col] !== null && row[col] !== undefined
              ? String(row[col])
              : "(Vacío)";
          return selectedValues.includes(rowValue);
        });
      });
  }, [rows, activeFilters]);

  // --- 5. LÓGICA DE PAGINACIÓN ---
  const totalItems = filteredRowsWithIndex.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    Math.max(1, totalPages)
  );
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedRows = filteredRowsWithIndex.slice(
    startIndex,
    startIndex + pageSize
  );

  // --- HANDLERS PAGINACIÓN Y VISUALIZACIÓN ---
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Volver a la primera página al cambiar el tamaño
    setIsPageSizeSelectorOpen(false);
  };

  const toggleColumnVisibility = (colName: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(colName)) newSet.delete(colName);
      else newSet.add(colName);
      return headers.filter((h) => newSet.has(h));
    });
  };

  // Clicks fuera (Unified)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target as Node)
      ) {
        setIsColumnSelectorOpen(false);
      }
      if (
        pageSizeSelectorRef.current &&
        !pageSizeSelectorRef.current.contains(event.target as Node)
      ) {
        setIsPageSizeSelectorOpen(false);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setOpenFilterColumn(null);
        setFilterSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenFilter = (col: string) => {
    if (openFilterColumn === col) setOpenFilterColumn(null);
    else {
      setOpenFilterColumn(col);
      setFilterSearchTerm("");
    }
  };

  const handleFilterValueChange = (col: string, value: string) => {
    setActiveFilters((prev) => {
      const currentFilters = prev[col] || getUniqueValues(col);
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((v) => v !== value)
        : [...currentFilters, value];
      const allValues = getUniqueValues(col);
      if (newFilters.length === allValues.length) {
        const copy = { ...prev };
        delete copy[col];
        return copy;
      }
      return { ...prev, [col]: newFilters };
    });
  };

  const handleSelectAllFilter = (col: string, select: boolean) => {
    setActiveFilters((prev) => {
      if (select) {
        const copy = { ...prev };
        delete copy[col];
        return copy;
      } else {
        return { ...prev, [col]: [] };
      }
    });
  };

  return (
    <div className="w-full text-left p-10 relative">
      <ConfirmationModal
        isOpen={showDiscardModal}
        title="Descartar cambios"
        message="¿Estás seguro de que quieres descartar todos los cambios no guardados? Esta acción no se puede deshacer."
        onConfirm={confirmDiscard}
        onCancel={() => setShowDiscardModal(false)}
      />

      {/* HEADER */}
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl text-[--color-naranjo] font-bold truncate">
              {loading ? (
                <Skeleton width={300} />
              ) : (
                `Tabla ${breadcrumbs?.tableName || ""}`
              )}
            </h1>
          </div>

          {/* CONTENEDOR DERECHA: SELECTORES DE VISTA */}
          {!loading && !file?.isEmpty && (
            <div className="flex items-center gap-3 mt-2">
              {/* 1. SELECTOR DE FILAS POR PÁGINA (NUEVO) */}
              <div className="relative" ref={pageSizeSelectorRef}>
                <button
                  onClick={() =>
                    setIsPageSizeSelectorOpen(!isPageSizeSelectorOpen)
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-orange-600 shadow-sm transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Ver: {pageSize}
                </button>

                {isPageSizeSelectorOpen && (
                  <div className="absolute top-12 right-0 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                    <div className="py-1">
                      {[50, 100, 200].map((size) => (
                        <button
                          key={size}
                          onClick={() => changePageSize(size)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${
                            pageSize === size
                              ? "text-orange-600 font-bold bg-orange-50"
                              : "text-gray-700"
                          }`}
                        >
                          {size} registros
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. SELECTOR DE COLUMNAS */}
              <div className="relative" ref={columnSelectorRef}>
                <button
                  onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-orange-600 shadow-sm transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                  Columnas ({visibleColumns.length})
                </button>
                {isColumnSelectorOpen && (
                  <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 bg-gray-50 border-b flex justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Mostrar/Ocultar
                      </span>
                      <button
                        onClick={() => setVisibleColumns(headers)}
                        className="text-xs text-orange-600 font-bold hover:underline"
                      >
                        Todas
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                      {headers.map((col) => (
                        <label
                          key={col}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col)}
                            onChange={() => toggleColumnVisibility(col)}
                            className="text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* TOOLBAR (Sin cambios, solo se muestra si hay datos) */}
        {!loading && !file?.isEmpty && (
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={handleAddRow}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
            >
              <span className="text-lg leading-none font-bold">+</span> Nueva
              Fila
            </button>
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            <button
              onClick={handleEditSelected}
              disabled={selectedRowIndices.size === 0}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded border transition-all ${
                selectedRowIndices.size > 0
                  ? "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer shadow-sm"
                  : "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>{" "}
              Editar ({selectedRowIndices.size})
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedRowIndices.size === 0}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded border transition-all ${
                selectedRowIndices.size > 0
                  ? "text-red-700 bg-red-50 border-red-200 hover:bg-red-100 cursor-pointer shadow-sm"
                  : "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>{" "}
              Eliminar ({selectedRowIndices.size})
            </button>
            <div className="flex-1"></div>
            {isDirty ? (
              <div className="flex items-center gap-2 animate-fadeIn">
                <button
                  onClick={handleDiscardClick}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-red-600 transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-[--color-naranjo] rounded shadow hover:bg-orange-600 transition-transform active:scale-95"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>{" "}
                  Guardar Cambios
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic px-2">
                Sin cambios pendientes
              </span>
            )}
          </div>
        )}
      </div>

      {/* --- TABLA --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible min-h-[400px]">
        {!loading && !file?.isEmpty && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-10 sticky left-0 z-20 bg-gray-50 border-b border-gray-200">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300 cursor-pointer"
                      checked={
                        filteredRowsWithIndex.length > 0 &&
                        filteredRowsWithIndex.every((r) =>
                          selectedRowIndices.has(r.originalIndex)
                        )
                      }
                      onChange={() =>
                        toggleSelectAll(
                          filteredRowsWithIndex.map((r) => r.originalIndex)
                        )
                      }
                    />
                  </th>
                  <th className="px-4 py-3 w-10 font-bold text-gray-400 bg-gray-50 sticky left-10 z-20 border-b border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    #
                  </th>
                  {visibleColumns.map((col) => {
                    const isFilterActive = !!activeFilters[col];
                    const isOpen = openFilterColumn === col;
                    const uniqueValues = getUniqueValues(col);
                    const displayedValues = uniqueValues.filter((v) =>
                      v.toLowerCase().includes(filterSearchTerm.toLowerCase())
                    );
                    const currentSelected = activeFilters[col] || uniqueValues;

                    return (
                      <th
                        key={col}
                        className="px-6 py-3 whitespace-nowrap border-b border-gray-200 relative group z-10"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="uppercase tracking-wider font-semibold text-[--color-naranjo] opacity-80 select-none">
                            {col}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFilter(col);
                            }}
                            className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                              isFilterActive
                                ? "text-orange-600 bg-orange-50"
                                : "text-gray-400 opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={isFilterActive ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                          </button>
                        </div>
                        {isOpen && (
                          <div
                            ref={filterMenuRef}
                            className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 text-left font-normal"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                placeholder="Buscar valor..."
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
                                value={filterSearchTerm}
                                onChange={(e) =>
                                  setFilterSearchTerm(e.target.value)
                                }
                                autoFocus
                              />
                            </div>
                            <div className="px-2 py-1 flex gap-2 text-xs border-b border-gray-100 bg-gray-50">
                              <button
                                onClick={() => handleSelectAllFilter(col, true)}
                                className="text-orange-600 hover:underline"
                              >
                                Selec. Todo
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() =>
                                  handleSelectAllFilter(col, false)
                                }
                                className="text-gray-500 hover:underline"
                              >
                                Borrar
                              </button>
                            </div>
                            <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                              {displayedValues.length > 0 ? (
                                displayedValues.map((val) => (
                                  <label
                                    key={val}
                                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={currentSelected.includes(val)}
                                      onChange={() =>
                                        handleFilterValueChange(col, val)
                                      }
                                      className="rounded text-orange-600 focus:ring-orange-500 border-gray-300 w-3.5 h-3.5"
                                    />
                                    <span className="text-sm text-gray-600 truncate">
                                      {val}
                                    </span>
                                  </label>
                                ))
                              ) : (
                                <p className="text-xs text-gray-400 text-center py-2">
                                  No hay resultados
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRows.length > 0 ? (
                  paginatedRows.map(
                    ({ data: row, originalIndex }, viewIndex) => {
                      const isSelected = selectedRowIndices.has(originalIndex);
                      const isEditingRow = editingRowIndices.has(originalIndex);
                      const globalIndex = startIndex + viewIndex + 1;

                      return (
                        <tr
                          key={originalIndex}
                          className={`transition-colors group ${
                            isSelected ? "bg-orange-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className={`px-4 py-4 sticky left-0 border-r border-transparent z-10 ${
                              isSelected
                                ? "bg-orange-50"
                                : "bg-white group-hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRowSelection(originalIndex)}
                              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300 cursor-pointer"
                            />
                          </td>
                          <td
                            className={`px-4 py-4 text-gray-400 font-mono text-xs sticky left-10 border-r border-gray-100 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${
                              isSelected
                                ? "bg-orange-50"
                                : "bg-white group-hover:bg-gray-50"
                            }`}
                          >
                            {globalIndex}
                          </td>
                          {visibleColumns.map((col) => {
                            const cellValue = row[col];
                            return (
                              <td
                                key={`${originalIndex}-${col}`}
                                className="px-6 py-4 whitespace-nowrap text-gray-700"
                              >
                                {isEditingRow ? (
                                  <input
                                    type="text"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-shadow"
                                    value={cellValue || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        originalIndex,
                                        col,
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : cellValue !== null &&
                                  cellValue !== undefined &&
                                  cellValue !== "" ? (
                                  cellValue.toString()
                                ) : (
                                  <span className="text-gray-300 italic">
                                    -
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 2}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No se encontraron registros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* --- FOOTER CON PAGINACIÓN --- */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between sticky left-0 bottom-0 z-20">
              <div className="text-xs text-gray-500 flex items-center gap-4">
                <span>
                  Mostrando{" "}
                  <span className="font-semibold">
                    {Math.min(startIndex + 1, totalItems)}
                  </span>{" "}
                  a{" "}
                  <span className="font-semibold">
                    {Math.min(startIndex + pageSize, totalItems)}
                  </span>{" "}
                  de <span className="font-semibold">{totalItems}</span>{" "}
                  registros
                </span>
                {isDirty && (
                  <span className="text-orange-600 font-bold ml-2 animate-pulse">
                    • Cambios sin guardar
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={safeCurrentPage === 1}
                  className={`p-2 rounded-lg border ${
                    safeCurrentPage === 1
                      ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-[--color-naranjo] hover:border-[--color-naranjo]"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-xs font-medium text-gray-600">
                  Página {safeCurrentPage} de {totalPages || 1}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={safeCurrentPage >= totalPages}
                  className={`p-2 rounded-lg border ${
                    safeCurrentPage >= totalPages
                      ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-[--color-naranjo] hover:border-[--color-naranjo]"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-10">
            <Skeleton count={5} />
          </div>
        )}
        {!loading && file?.isEmpty && (
          <div className="p-10 text-center text-gray-500">Sin datos</div>
        )}
      </div>
    </div>
  );
}
