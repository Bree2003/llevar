import { useState, useEffect, useMemo } from "react";
import { FileData } from "./types";

export const useDataGridLogic = (file: FileData | undefined, onSave?: (rows: any[]) => void) => {
  const headers = file?.headers || [];
  
  // --- STATES ---
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [originalRows, setOriginalRows] = useState<Record<string, any>[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  
  // UI States
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Selection & Editing States
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(new Set());
  const [editingRowIndices, setEditingRowIndices] = useState<Set<number>>(new Set());
  
  // Modals
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // <--- NUEVO

  // Sorting State <--- NUEVO
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // --- INITIALIZATION ---
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
      setSortConfig(null);
    }
  }, [file]);

  // --- LOGIC ---
  const getUniqueValues = (col: string) => {
    const values = Array.from(new Set(rows.map((row) => row[col] !== null && row[col] !== undefined ? String(row[col]) : "(Vacío)")));
    return values.sort();
  };

  const filteredRowsWithIndex = useMemo(() => {
    // 1. Mapear con índice original
    let result = rows.map((row, idx) => ({ data: row, originalIndex: idx }));

    // 2. Filtrar
    result = result.filter(({ data: row }) => {
        return Object.entries(activeFilters).every(([col, selectedValues]) => {
          if (selectedValues.length === 0) return false;
          const rowValue = row[col] !== null && row[col] !== undefined ? String(row[col]) : "(Vacío)";
          return selectedValues.includes(rowValue);
        });
    });

    // 3. Ordenar (Sorting) <--- NUEVO
    if (sortConfig) {
        result.sort((a, b) => {
            const valA = a.data[sortConfig.key];
            const valB = b.data[sortConfig.key];

            // Manejo de nulos
            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            // Comparación numérica o de string
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            } else {
                return sortConfig.direction === 'asc' 
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            }
        });
    }

    return result;
  }, [rows, activeFilters, sortConfig]); // <--- Dependencia sortConfig añadida

  // Pagination Logic
  const totalItems = filteredRowsWithIndex.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedRows = filteredRowsWithIndex.slice(startIndex, startIndex + pageSize);

  // --- HANDLERS ---
  
  // Sorting Handler <--- NUEVO

    const handleSort = (col: string, direction: 'asc' | 'desc') => {
      setSortConfig(current => {
        // Si ya estábamos ordenando por esta columna Y en esta dirección...
        if (current?.key === col && current?.direction === direction) {
          return null; // ...Desactivamos el sort (volvemos al original)
        }
        // Si no, aplicamos el nuevo orden
        return { key: col, direction };
      });
      // Opcional: Cerrar el menú después de ordenar
      // setOpenFilterColumn(null); 
  };

  const handleInputChange = (rowIdx: number, col: string, newValue: string) => {
    setRows((prev) => {
      const newRows = [...prev];
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

  // Solo abre el modal, no borra aún
  const handleDeleteRequest = () => { 
      if (selectedRowIndices.size > 0) setShowDeleteModal(true);
  };

  // Borra de verdad
  const confirmDelete = () => {
    const newRows = rows.filter((_, index) => !selectedRowIndices.has(index));
    setRows(newRows);
    setSelectedRowIndices(new Set());
    setEditingRowIndices(new Set());
    setIsDirty(true);
    setCurrentPage(1);
    setShowDeleteModal(false); // Cierra modal
  };

  const handleSave = () => {
    if (onSave) onSave(rows);
    setOriginalRows(JSON.parse(JSON.stringify(rows)));
    setIsDirty(false);
    setEditingRowIndices(new Set());
    setSelectedRowIndices(new Set());
  };

  const confirmDiscard = () => {
    setRows(JSON.parse(JSON.stringify(originalRows)));
    setIsDirty(false);
    setSelectedRowIndices(new Set());
    setEditingRowIndices(new Set());
    setShowDiscardModal(false);
    setCurrentPage(1);
  };

  const toggleColumnVisibility = (colName: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(colName)) newSet.delete(colName);
      else newSet.add(colName);
      return headers.filter((h) => newSet.has(h));
    });
  };

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
      if (allVisibleSelected) filteredIndices.forEach((idx) => newSet.delete(idx));
      else filteredIndices.forEach((idx) => newSet.add(idx));
      return newSet;
    });
  };

  const handleEditSelected = () => {
      setEditingRowIndices(prev => {
          const newSet = new Set(prev);
          selectedRowIndices.forEach(idx => newSet.add(idx));
          return newSet;
      })
  }

  const handleFilterValueChange = (col: string, value: string) => {
    setActiveFilters((prev) => {
      const currentFilters = prev[col] || getUniqueValues(col);
      const newFilters = currentFilters.includes(value) ? currentFilters.filter((v) => v !== value) : [...currentFilters, value];
      const allValues = getUniqueValues(col);
      if (newFilters.length === allValues.length) { const copy = { ...prev }; delete copy[col]; return copy; }
      return { ...prev, [col]: newFilters };
    });
  };

  const handleSelectAllFilter = (col: string, select: boolean) => {
    setActiveFilters((prev) => {
      if (select) { const copy = { ...prev }; delete copy[col]; return copy; }
      else { return { ...prev, [col]: [] }; }
    });
  };

  return {
    rows, headers, visibleColumns, activeFilters, openFilterColumn, filterSearchTerm,
    currentPage, pageSize, selectedRowIndices, editingRowIndices, isDirty, 
    showDiscardModal, showDeleteModal, sortConfig, // Exports nuevos
    totalItems, totalPages, safeCurrentPage, startIndex, paginatedRows,
    setOpenFilterColumn, setFilterSearchTerm, setShowDiscardModal, setShowDeleteModal, setCurrentPage, setPageSize, setVisibleColumns,
    handleInputChange, handleAddRow, handleDeleteRequest, confirmDelete, handleSave, confirmDiscard,
    toggleColumnVisibility, toggleRowSelection, toggleSelectAll, handleEditSelected,
    handleFilterValueChange, handleSelectAllFilter, getUniqueValues, filteredRowsWithIndex, handleSort
  };
};