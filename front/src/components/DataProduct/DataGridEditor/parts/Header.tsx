import { useState, useRef, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

interface DataGridHeaderProps {
  loading?: boolean;
  tableName?: string;
  pageSize: number;
  setPageSize: (size: number) => void;
  visibleColumns: string[];
  headers: string[];
  setVisibleColumns: (cols: string[]) => void;
}

export const DataGridHeader = ({
  loading,
  tableName,
  pageSize,
  setPageSize,
  visibleColumns,
  headers,
  setVisibleColumns,
}: DataGridHeaderProps) => {
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [isColSelectorOpen, setIsColSelectorOpen] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node))
        setIsPageSizeOpen(false);
      if (colRef.current && !colRef.current.contains(e.target as Node))
        setIsColSelectorOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  const toggleCol = (col: string) => {
    const newSet = new Set(visibleColumns);
    if (newSet.has(col)) newSet.delete(col);
    else newSet.add(col);
    setVisibleColumns(headers.filter((h) => newSet.has(h)));
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h1 className="text-3xl text-[--color-naranjo] font-bold truncate">
          {loading ? <Skeleton width={300} /> : `Tabla ${tableName || ""}`}
        </h1>
      </div>

      {!loading && (
        <div className="flex items-center gap-3 mt-2">
          {/* Page Size Selector */}
          <div className="relative" ref={sizeRef}>
            <button
              onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-orange-600 shadow-sm transition-colors"
            >
              Ver: {pageSize}
            </button>
            {isPageSizeOpen && (
              <div className="absolute top-12 right-0 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                {[50, 100, 200].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setPageSize(size);
                      setIsPageSizeOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 ${
                      pageSize === size ? "text-orange-600 font-bold" : ""
                    }`}
                  >
                    {size} registros
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column Selector */}
          <div className="relative" ref={colRef}>
            <button
              onClick={() => setIsColSelectorOpen(!isColSelectorOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-orange-600 shadow-sm transition-colors"
            >
              Columnas ({visibleColumns.length})
            </button>
            {isColSelectorOpen && (
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
                      className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col)}
                        onChange={() => toggleCol(col)}
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
  );
};
