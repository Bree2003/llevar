import React, { useRef, useEffect } from "react";

interface DataGridTableProps {
  paginatedRows: Array<{ data: Record<string, any>; originalIndex: number }>;
  visibleColumns: string[];
  startIndex: number;
  filteredRowsWithIndex: any[];
  selectedRowIndices: Set<number>;
  editingRowIndices: Set<number>;
  activeFilters: Record<string, string[]>;
  openFilterColumn: string | null;
  filterSearchTerm: string;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;

  onToggleRowSelection: (index: number) => void;
  onToggleSelectAll: (indices: number[]) => void;
  onInputChange: (rowIdx: number, col: string, val: string) => void;

  onOpenFilter: (col: string | null) => void;
  onFilterSearch: (term: string) => void;
  onFilterValueChange: (col: string, val: string) => void;
  onSelectAllFilter: (col: string, select: boolean) => void;
  getUniqueValues: (col: string) => string[];
  onSort: (col: string, direction: "asc" | "desc") => void;
}

export const DataGridTable = ({
  paginatedRows,
  visibleColumns,
  startIndex,
  filteredRowsWithIndex,
  selectedRowIndices,
  editingRowIndices,
  activeFilters,
  openFilterColumn,
  filterSearchTerm,
  sortConfig,
  onToggleRowSelection,
  onToggleSelectAll,
  onInputChange,
  onOpenFilter,
  onFilterSearch,
  onFilterValueChange,
  onSelectAllFilter,
  getUniqueValues,
  onSort,
}: DataGridTableProps) => {
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        onOpenFilter(null);
        onFilterSearch("");
      }
    }
    if (openFilterColumn) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilterColumn, onOpenFilter, onFilterSearch]);

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] min-h-[500px] relative">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {/* Checkbox */}
            <th className="px-4 py-3 w-10 sticky left-0 top-0 z-30 bg-gray-50 border-b border-gray-200 shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]">
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
                  onToggleSelectAll(
                    filteredRowsWithIndex.map((r) => r.originalIndex)
                  )
                }
              />
            </th>

            {/* # */}
            <th className="px-4 py-3 w-10 font-bold text-gray-400 bg-gray-50 sticky left-10 top-0 z-30 border-b border-gray-200 shadow-[2px_2px_5px_-2px_rgba(0,0,0,0.1)]">
              #
            </th>

            {/* Columns */}
            {visibleColumns.map((col) => {
              const isFilterActive = !!activeFilters[col];
              const isSortedAsc =
                sortConfig?.key === col && sortConfig?.direction === "asc";
              const isSortedDesc =
                sortConfig?.key === col && sortConfig?.direction === "desc";
              const isOpen = openFilterColumn === col;

              const uniqueValues = getUniqueValues(col);
              const displayedValues = uniqueValues.filter((v) =>
                v.toLowerCase().includes(filterSearchTerm.toLowerCase())
              );
              const currentSelected = activeFilters[col] || uniqueValues;

              return (
                <th
                  key={col}
                  className="px-6 py-3 whitespace-nowrap border-b border-gray-200 relative group sticky top-0 z-20 bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span
                        className={`uppercase tracking-wider font-semibold select-none ${
                          isSortedAsc || isSortedDesc
                            ? "text-orange-700"
                            : "text-[--color-naranjo] opacity-80"
                        }`}
                      >
                        {col}
                      </span>
                      {/* Indicador visual de Sort activo en el header */}
                      {isSortedAsc && (
                        <span className="text-orange-600 text-[10px]">▲</span>
                      )}
                      {isSortedDesc && (
                        <span className="text-orange-600 text-[10px]">▼</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFilter(isOpen ? null : col);
                      }}
                      className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                        isFilterActive || isSortedAsc || isSortedDesc
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

                  {/* Dropdown */}
                  {isOpen && (
                    <div
                      ref={filterMenuRef}
                      className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 text-left font-normal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* SECCION SORTING */}
                      <div className="flex border-b border-gray-100">
                        <button
                          onClick={() => onSort(col, "asc")}
                          className={`flex-1 px-4 py-2 text-xs font-medium hover:bg-orange-50 flex items-center justify-center gap-1 ${
                            isSortedAsc
                              ? "text-orange-600 bg-orange-50"
                              : "text-gray-600"
                          }`}
                        >
                          <span>Ascendente</span> <span>▲</span>
                        </button>
                        <div className="w-px bg-gray-100"></div>
                        <button
                          onClick={() => onSort(col, "desc")}
                          className={`flex-1 px-4 py-2 text-xs font-medium hover:bg-orange-50 flex items-center justify-center gap-1 ${
                            isSortedDesc
                              ? "text-orange-600 bg-orange-50"
                              : "text-gray-600"
                          }`}
                        >
                          <span>Descendente</span> <span>▼</span>
                        </button>
                      </div>

                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          placeholder="Buscar valor..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
                          value={filterSearchTerm}
                          onChange={(e) => onFilterSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="px-2 py-1 flex gap-2 text-xs border-b border-gray-100 bg-gray-50">
                        <button
                          onClick={() => onSelectAllFilter(col, true)}
                          className="text-orange-600 hover:underline"
                        >
                          Selec. Todo
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => onSelectAllFilter(col, false)}
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
                                onChange={() => onFilterValueChange(col, val)}
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

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedRows.length > 0 ? (
            paginatedRows.map(({ data: row, originalIndex }, viewIndex) => {
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
                      onChange={() => onToggleRowSelection(originalIndex)}
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
                              onInputChange(originalIndex, col, e.target.value)
                            }
                          />
                        ) : cellValue !== null &&
                          cellValue !== undefined &&
                          cellValue !== "" ? (
                          cellValue.toString()
                        ) : (
                          <span className="text-gray-300 italic">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
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
    </div>
  );
};
