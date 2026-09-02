import React from "react";

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

        flex
        items-center
        justify-center
        gap-2.5

        px-5
        py-2.5

        rounded-[10px]

        text-sm
        font-semibold

        border

        transition-all

        ${
          isDisabled
            ? `
              bg-gray-100
              border-gray-200
              text-gray-400
              cursor-not-allowed
            `
            : `
              bg-white
              border-[--color-accent]
              text-[--color-accent]

              hover:bg-[--color-accent-light]
            `
        }
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Procesando...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          Reprocesar Producto
        </>
      )}
    </button>
  );
};

export default PipelineButton;
