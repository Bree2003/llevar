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
  return (
    <button
      onClick={onRun}
      disabled={disabled || isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all shadow-sm
        ${
          isLoading || disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-[--color-naranjo] border-[--color-naranjo] hover:bg-orange-50 active:scale-95"
        }
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-[--color-naranjo]"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Procesando...</span>
        </>
      ) : (
        <>
          {/* Icono de Play / Engranaje */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Reprocesar Producto</span>
        </>
      )}
    </button>
  );
};

export default PipelineButton;
