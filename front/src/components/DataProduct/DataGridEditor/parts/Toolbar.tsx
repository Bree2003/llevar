import React from "react";

interface DataGridToolbarProps {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void; // Este ahora abrirá el modal
  onSave: () => void;
  onDiscard: () => void;
  selectedCount: number;
  isDirty: boolean;
  loading?: boolean;
}

export const DataGridToolbar = ({
  onAdd,
  onEdit,
  onDelete,
  onSave,
  onDiscard,
  selectedCount,
  isDirty,
  loading,
}: DataGridToolbarProps) => {
  if (loading) return null;
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm mb-4">
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
      >
        <span className="text-lg leading-none font-bold">+</span> Nueva Fila
      </button>
      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <button
        onClick={onEdit}
        disabled={selectedCount === 0}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded border transition-all ${
          selectedCount > 0
            ? "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 shadow-sm"
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
        Editar ({selectedCount})
      </button>

      {/* Botón Eliminar: Ahora activará el modal desde el padre */}
      <button
        onClick={onDelete}
        disabled={selectedCount === 0}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded border transition-all ${
          selectedCount > 0
            ? "text-red-700 bg-red-50 border-red-200 hover:bg-red-100 shadow-sm"
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
        Eliminar ({selectedCount})
      </button>

      <div className="flex-1"></div>

      {isDirty ? (
        <div className="flex items-center gap-2 animate-fadeIn">
          <button
            onClick={onDiscard}
            className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            Descartar
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-[--color-naranjo] rounded shadow hover:bg-orange-600 transition-transform active:scale-95"
          >
            {/* NUEVO ICONO: Cloud Upload (Nube con flecha arriba) */}
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Guardar Cambios
          </button>
        </div>
      ) : (
        <span className="text-xs text-gray-400 italic px-2">
          Sin cambios pendientes
        </span>
      )}
    </div>
  );
};
