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
  const firstItem = totalItems === 0 ? 0 : startIndex + 1;

  const lastItem = Math.min(startIndex + pageSize, totalItems);

  return (
    <div
      className="
        w-full

        px-4
        py-4

        md:px-6

        bg-[--color-background]

        border-t
        border-[--color-border]

        flex
        flex-col
        md:flex-row

        md:items-center
        md:justify-between

        gap-4
      "
    >
      {/* INFO */}
      <div
        className="
          flex
          flex-col
          sm:flex-row

          sm:items-center

          gap-2
          sm:gap-4

          text-xs
          md:text-sm

          text-[--color-text-secondary]
        "
      >
        <span>
          Mostrando <strong>{firstItem}</strong> a <strong>{lastItem}</strong>{" "}
          de <strong>{totalItems}</strong> registros
        </span>

        {isDirty && (
          <span
            className="
              w-fit

              px-2.5
              py-1

              rounded-full

              bg-[--color-accent-light]

              text-xs
              font-semibold

              text-[--color-accent]
            "
          >
            Cambios sin guardar
          </span>
        )}
      </div>

      {/* PAGINACIÓN */}
      <div
        className="
          flex
          items-center
          justify-between
          md:justify-end

          gap-3
        "
      >
        <button
          type="button"
          aria-label="Página anterior"
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`
            w-9
            h-9

            flex
            items-center
            justify-center

            rounded-[10px]

            border

            transition-colors

            ${
              currentPage === 1
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                : "bg-white text-[--color-text-secondary] border-[--color-border] hover:bg-[--color-accent-light] hover:text-[--color-accent]"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <span
          className="
            min-w-[100px]

            text-center

            text-xs
            md:text-sm

            font-medium

            text-[--color-text-secondary]
          "
        >
          Página {currentPage} de {totalPages || 1}
        </span>

        <button
          type="button"
          aria-label="Página siguiente"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className={`
            w-9
            h-9

            flex
            items-center
            justify-center

            rounded-[10px]

            border

            transition-colors

            ${
              currentPage >= totalPages
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                : "bg-white text-[--color-text-secondary] border-[--color-border] hover:bg-[--color-accent-light] hover:text-[--color-accent]"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
