import React from "react";

interface DataGridFooterProps {
  startIndex: number;
  pageSize: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  isDirty: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const DataGridFooter = ({
  startIndex,
  pageSize,
  totalItems,
  currentPage,
  totalPages,
  isDirty,
  onPrev,
  onNext,
}: DataGridFooterProps) => {
  return (
    // CAMBIO AQUÍ: Eliminado 'sticky left-0 bottom-0 z-20'
    // Ahora es un flex container normal que se posicionará naturalmente al final
    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
      {/* LADO IZQUIERDO: Información */}
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
          de <span className="font-semibold">{totalItems}</span> registros
        </span>
        {isDirty && (
          <span className="text-orange-600 font-bold ml-2 animate-pulse">
            • Cambios sin guardar
          </span>
        )}
      </div>

      {/* LADO DERECHO: Botones */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border ${
            currentPage === 1
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
          Página {currentPage} de {totalPages || 1}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className={`p-2 rounded-lg border ${
            currentPage >= totalPages
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
  );
};
