interface DataGridToolbarProps {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
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

  const hasSelection = selectedCount > 0;

  return (
    <div
      className="
        w-full

        p-4
        md:p-5

        border-b
        border-[--color-border]

        flex
        flex-col
        xl:flex-row

        xl:items-center
        xl:justify-between

        gap-4
      "
    >
      {/* ACCIONES DE FILA */}
      <div
        className="
          w-full
          xl:w-auto

          grid
          grid-cols-1
          sm:grid-cols-3

          gap-2
        "
      >
        {/* NUEVA */}
        <button
          type="button"
          onClick={onAdd}
          className="
            flex
            items-center
            justify-center
            gap-2

            px-4
            py-2.5

            rounded-[10px]

            border
            border-[--color-accent]

            bg-white

            text-sm
            font-semibold
            text-[--color-accent]

            hover:bg-[--color-accent-light]

            transition-colors

            whitespace-nowrap
          "
        >
          <span className="text-lg leading-none">+</span>
          Nueva fila
        </button>

        {/* EDITAR */}
        <button
          type="button"
          onClick={onEdit}
          disabled={!hasSelection}
          className={`
            flex
            items-center
            justify-center
            gap-2

            px-4
            py-2.5

            rounded-[10px]

            border

            text-sm
            font-semibold

            transition-colors

            whitespace-nowrap

            ${
              hasSelection
                ? "bg-white border-[--color-border] text-[--color-text-secondary] hover:bg-[--color-background] hover:text-[--color-accent]"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
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
          </svg>
          Editar ({selectedCount})
        </button>

        {/* ELIMINAR */}
        <button
          type="button"
          onClick={onDelete}
          disabled={!hasSelection}
          className={`
            flex
            items-center
            justify-center
            gap-2

            px-4
            py-2.5

            rounded-[10px]

            border

            text-sm
            font-semibold

            transition-colors

            whitespace-nowrap

            ${
              hasSelection
                ? "bg-white border-red-200 text-red-600 hover:bg-red-50"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
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
          </svg>
          Eliminar ({selectedCount})
        </button>
      </div>

      {/* CAMBIOS */}
      {isDirty ? (
        <div
          className="
            w-full
            xl:w-auto

            flex
            flex-col-reverse
            sm:flex-row

            gap-2
          "
        >
          <button
            type="button"
            onClick={onDiscard}
            className="
              w-full
              sm:w-auto

              px-4
              py-2.5

              rounded-[10px]

              border
              border-[--color-border]

              bg-white

              text-sm
              font-medium

              text-[--color-text-secondary]

              hover:bg-[--color-background]

              transition-colors
            "
          >
            Descartar cambios
          </button>

          <button
            type="button"
            onClick={onSave}
            className="
              w-full
              sm:w-auto

              flex
              items-center
              justify-center
              gap-2

              px-5
              py-2.5

              rounded-[10px]

              bg-[--color-accent]

              text-sm
              font-semibold
              text-white

              hover:opacity-90

              transition-opacity
            "
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Guardar cambios
          </button>
        </div>
      ) : (
        <span
          className="
            text-xs
            md:text-sm

            text-[--color-text-muted]
          "
        >
          Sin cambios pendientes
        </span>
      )}
    </div>
  );
};
