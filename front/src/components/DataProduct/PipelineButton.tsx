interface PipelineButtonProps {
  onRun: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const PipelineButton = ({
  onRun,
  isLoading,
  disabled,
}: PipelineButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onRun}
      disabled={isDisabled}
      className={`
        w-full

        group

        relative

        flex
        items-center
        justify-center

        gap-2.5

        px-6
        py-2.5

        rounded-xl

        font-bold
        text-sm

        transition-all
        duration-200

        ${
          isDisabled
            ? `
              bg-gray-100
              text-gray-400

              border
              border-[--color-border]

              cursor-not-allowed
            `
            : `
              bg-white

              text-[--color-accent]

              border-2
              border-[--color-accent]

              hover:bg-[--color-accent-light]

              active:scale-[0.98]
            `
        }
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="
              animate-spin
              h-5
              w-5
            "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>

          <span>Procesando...</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="
              h-5
              w-5

              transition-transform

              group-hover:translate-x-0.5
            "
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>

          <span>Reprocesar Producto</span>
        </>
      )}
    </button>
  );
};

export default PipelineButton;
