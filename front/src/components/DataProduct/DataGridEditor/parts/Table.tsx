import { useEffect, useRef } from "react";

interface DataGridTableProps {
  paginatedRows: Array<{
    data: Record<string, any>;
    originalIndex: number;
  }>;

  visibleColumns: string[];

  startIndex: number;

  filteredRowsWithIndex: any[];

  selectedRowIndices: Set<number>;
  editingRowIndices: Set<number>;

  activeFilters: Record<string, string[]>;

  openFilterColumn: string | null;

  filterSearchTerm: string;

  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  } | null;

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

  const allSelected =
    filteredRowsWithIndex.length > 0 &&
    filteredRowsWithIndex.every((row) =>
      selectedRowIndices.has(row.originalIndex),
    );

  return (
    <div
      className="
        w-full

        overflow-auto

        max-h-[65vh]
        min-h-[420px]

        relative
      "
    >
      <table
        className="
          w-full
          min-w-max

          border-collapse

          text-sm
          text-left
        "
      >
        {/* HEADER */}
        <thead>
          <tr>
            {/* CHECK */}
            <th
              className="
                w-12
                min-w-12

                px-4
                py-3

                sticky
                left-0
                top-0

                z-40

                bg-[--color-background]

                border-b
                border-r
                border-[--color-border]
              "
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() =>
                  onToggleSelectAll(
                    filteredRowsWithIndex.map((row) => row.originalIndex),
                  )
                }
                className="
                  w-4
                  h-4

                  accent-[--color-accent]

                  cursor-pointer
                "
              />
            </th>

            {/* INDEX */}
            <th
              className="
                w-14
                min-w-14

                px-4
                py-3

                sticky
                left-12
                top-0

                z-40

                bg-[--color-background]

                border-b
                border-r
                border-[--color-border]

                text-xs
                font-semibold

                text-[--color-text-muted]
              "
            >
              #
            </th>

            {/* COLUMNAS */}
            {visibleColumns.map((column) => {
              const isFilterActive = !!activeFilters[column];

              const isSortedAsc =
                sortConfig?.key === column && sortConfig.direction === "asc";

              const isSortedDesc =
                sortConfig?.key === column && sortConfig.direction === "desc";

              const isOpen = openFilterColumn === column;

              const uniqueValues = getUniqueValues(column);

              const displayedValues = uniqueValues.filter((value) =>
                value.toLowerCase().includes(filterSearchTerm.toLowerCase()),
              );

              const currentSelected = activeFilters[column] || uniqueValues;

              return (
                <th
                  key={column}
                  className="
                      min-w-[180px]

                      px-5
                      py-3

                      sticky
                      top-0

                      z-30

                      bg-[--color-background]

                      border-b
                      border-[--color-border]

                      relative
                      group
                    "
                >
                  <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                  >
                    <div
                      className="
                          flex
                          items-center
                          gap-1.5

                          min-w-0
                        "
                    >
                      <span
                        className={`
                            text-xs

                            font-semibold
                            uppercase
                            tracking-wide

                            truncate

                            ${
                              isSortedAsc || isSortedDesc
                                ? "text-[--color-accent]"
                                : "text-[--color-text-secondary]"
                            }
                          `}
                      >
                        {column}
                      </span>

                      {isSortedAsc && (
                        <span className="text-[--color-accent] text-[10px]">
                          ▲
                        </span>
                      )}

                      {isSortedDesc && (
                        <span className="text-[--color-accent] text-[10px]">
                          ▼
                        </span>
                      )}
                    </div>

                    {/* FILTRO */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        onOpenFilter(isOpen ? null : column);
                      }}
                      className={`
                          w-7
                          h-7

                          flex
                          items-center
                          justify-center

                          rounded-md

                          transition-colors

                          ${
                            isFilterActive ||
                            isSortedAsc ||
                            isSortedDesc ||
                            isOpen
                              ? "bg-[--color-accent-light] text-[--color-accent] opacity-100"
                              : "text-[--color-text-muted] opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-white"
                          }
                        `}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={isFilterActive ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                    </button>
                  </div>

                  {/* FILTER MENU */}
                  {isOpen && (
                    <div
                      ref={filterMenuRef}
                      onClick={(event) => event.stopPropagation()}
                      className="
                          absolute

                          top-[calc(100%+8px)]
                          right-0

                          z-50

                          w-64
                          max-w-[calc(100vw-3rem)]

                          rounded-xl

                          bg-white

                          border
                          border-[--color-border]

                          shadow-xl

                          overflow-hidden

                          font-normal
                          text-left
                        "
                    >
                      {/* SORT */}
                      <div
                        className="
                            grid
                            grid-cols-2

                            border-b
                            border-[--color-border]
                          "
                      >
                        <button
                          type="button"
                          onClick={() => onSort(column, "asc")}
                          className={`
                              px-3
                              py-2.5

                              text-xs
                              font-medium

                              transition-colors

                              ${
                                isSortedAsc
                                  ? "bg-[--color-accent-light] text-[--color-accent]"
                                  : "text-[--color-text-secondary] hover:bg-[--color-background]"
                              }
                            `}
                        >
                          Ascendente ↑
                        </button>

                        <button
                          type="button"
                          onClick={() => onSort(column, "desc")}
                          className={`
                              px-3
                              py-2.5

                              text-xs
                              font-medium

                              border-l
                              border-[--color-border]

                              transition-colors

                              ${
                                isSortedDesc
                                  ? "bg-[--color-accent-light] text-[--color-accent]"
                                  : "text-[--color-text-secondary] hover:bg-[--color-background]"
                              }
                            `}
                        >
                          Descendente ↓
                        </button>
                      </div>

                      {/* SEARCH */}
                      <div
                        className="
                            p-3

                            border-b
                            border-[--color-border]
                          "
                      >
                        <input
                          type="text"
                          value={filterSearchTerm}
                          onChange={(event) =>
                            onFilterSearch(event.target.value)
                          }
                          placeholder="Buscar valor..."
                          autoFocus
                          className="
                              w-full

                              px-3
                              py-2

                              rounded-[8px]

                              border
                              border-[--color-border]

                              text-sm
                              text-[--color-text-primary]

                              outline-none

                              focus:border-[--color-accent]
                              focus:ring-2
                              focus:ring-[--color-accent-light]
                            "
                        />
                      </div>

                      {/* TODOS */}
                      <div
                        className="
                            px-3
                            py-2

                            flex
                            items-center
                            gap-3

                            bg-[--color-background]

                            border-b
                            border-[--color-border]
                          "
                      >
                        <button
                          type="button"
                          onClick={() => onSelectAllFilter(column, true)}
                          className="
                              text-xs
                              font-semibold
                              text-[--color-accent]
                            "
                        >
                          Seleccionar todo
                        </button>

                        <span className="text-[--color-border]">|</span>

                        <button
                          type="button"
                          onClick={() => onSelectAllFilter(column, false)}
                          className="
                              text-xs
                              text-[--color-text-secondary]
                            "
                        >
                          Limpiar
                        </button>
                      </div>

                      {/* VALUES */}
                      <div
                        className="
                            max-h-52

                            overflow-y-auto

                            p-2
                          "
                      >
                        {displayedValues.length > 0 ? (
                          displayedValues.map((value) => (
                            <label
                              key={value}
                              className="
                                    flex
                                    items-center
                                    gap-2

                                    px-2
                                    py-2

                                    rounded-lg

                                    cursor-pointer

                                    hover:bg-[--color-background]
                                  "
                            >
                              <input
                                type="checkbox"
                                checked={currentSelected.includes(value)}
                                onChange={() =>
                                  onFilterValueChange(column, value)
                                }
                                className="
                                      w-4
                                      h-4

                                      accent-[--color-accent]
                                    "
                              />

                              <span
                                className="
                                      min-w-0

                                      text-sm

                                      text-[--color-text-secondary]

                                      truncate
                                    "
                              >
                                {value}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p
                            className="
                                py-4
                                text-xs
                                text-center
                                text-[--color-text-muted]
                              "
                          >
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

        {/* BODY */}
        <tbody className="bg-white">
          {paginatedRows.length > 0 ? (
            paginatedRows.map(({ data: row, originalIndex }, viewIndex) => {
              const isSelected = selectedRowIndices.has(originalIndex);

              const isEditingRow = editingRowIndices.has(originalIndex);

              const globalIndex = startIndex + viewIndex + 1;

              return (
                <tr
                  key={originalIndex}
                  className={`
                      group

                      border-b
                      last:border-b-0
                      border-[--color-border]

                      transition-colors

                      ${
                        isSelected
                          ? "bg-[--color-accent-light]"
                          : "hover:bg-[--color-background]"
                      }
                    `}
                >
                  {/* CHECK */}
                  <td
                    className={`
                        w-12
                        min-w-12

                        px-4
                        py-4

                        sticky
                        left-0

                        z-20

                        border-r
                        border-[--color-border]

                        ${
                          isSelected
                            ? "bg-[--color-accent-light]"
                            : "bg-white group-hover:bg-[--color-background]"
                        }
                      `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleRowSelection(originalIndex)}
                      className="
                          w-4
                          h-4

                          accent-[--color-accent]

                          cursor-pointer
                        "
                    />
                  </td>

                  {/* INDEX */}
                  <td
                    className={`
                        w-14
                        min-w-14

                        px-4
                        py-4

                        sticky
                        left-12

                        z-20

                        border-r
                        border-[--color-border]

                        font-mono
                        text-xs

                        text-[--color-text-muted]

                        ${
                          isSelected
                            ? "bg-[--color-accent-light]"
                            : "bg-white group-hover:bg-[--color-background]"
                        }
                      `}
                  >
                    {globalIndex}
                  </td>

                  {/* CELLS */}
                  {visibleColumns.map((column) => {
                    const cellValue = row[column];

                    return (
                      <td
                        key={`${originalIndex}-${column}`}
                        className="
                              min-w-[180px]

                              px-5
                              py-4

                              text-sm

                              text-[--color-text-secondary]

                              whitespace-nowrap
                            "
                      >
                        {isEditingRow ? (
                          <input
                            type="text"
                            value={cellValue || ""}
                            onChange={(event) =>
                              onInputChange(
                                originalIndex,
                                column,
                                event.target.value,
                              )
                            }
                            className="
                                  w-full
                                  min-w-[150px]

                                  px-3
                                  py-2

                                  rounded-[8px]

                                  border
                                  border-[--color-border]

                                  bg-white

                                  text-sm
                                  text-[--color-text-primary]

                                  outline-none

                                  focus:border-[--color-accent]
                                  focus:ring-2
                                  focus:ring-[--color-accent-light]

                                  transition-all
                                "
                          />
                        ) : cellValue !== null &&
                          cellValue !== undefined &&
                          cellValue !== "" ? (
                          cellValue.toString()
                        ) : (
                          <span className="text-[--color-text-muted]">—</span>
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
                className="
                  px-6
                  py-12

                  text-center

                  text-[--color-text-secondary]
                "
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
