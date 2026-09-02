import { useCallback, useEffect, useState } from "react";

import { ReactComponent as Ok } from "components/Global/Icons/tick-circle.svg";
import { ReactComponent as Error } from "components/Global/Icons/close-circle.svg";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

type Log = {
  dataset: string;
  file_name: string;
  timestamp: string;
  severity: string;
};

interface ResumenProductoProps {
  productName: string;
}

export default function ResumenProducto({ productName }: ResumenProductoProps) {
  const [logs, setLogs] = useState<Log[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!productName) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logs/product/${productName}?limit=4`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      setLogs(data.logs || []);
    } catch (error) {
      console.error("Error al obtener los logs:", error);

      setLogs([]);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [productName]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString("es-CL");

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const SkeletonRow = () => (
    <tr className="border-b border-[--color-border]">
      <td className="px-5 md:px-6 py-4">
        <Skeleton width={120} />
      </td>

      <td className="px-5 md:px-6 py-4">
        <Skeleton width={180} />
      </td>

      <td className="px-5 md:px-6 py-4">
        <Skeleton width={80} />
      </td>

      <td className="px-5 md:px-6 py-4">
        <Skeleton width={55} />
      </td>

      <td className="px-5 md:px-6 py-4">
        <Skeleton width={70} />
      </td>
    </tr>
  );

  return (
    <div
      className="
        w-full

        bg-white

        border
        border-[--color-border]

        rounded-2xl

        overflow-hidden
      "
    >
      {/* HEADER */}
      <div
        className="
          p-5
          md:p-6

          flex
          flex-col
          sm:flex-row

          sm:items-center
          sm:justify-between

          gap-4

          border-b
          border-[--color-border]
        "
      >
        <div>
          <h2
            className="
              text-xl
              md:text-2xl

              font-bold

              text-[--color-text-primary]
            "
          >
            Resumen de tablas
          </h2>

          <p
            className="
              mt-1

              text-sm

              text-[--color-text-secondary]
            "
          >
            Revisa las cargas más recientes asociadas a este producto.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          disabled={isLoading}
          className="
            w-full
            sm:w-auto

            flex
            items-center
            justify-center
            gap-2

            px-3
            py-2

            rounded-[10px]

            border
            border-[--color-border]

            text-sm
            font-medium

            text-[--color-text-secondary]

            bg-white

            hover:bg-[--color-accent-light]
            hover:text-[--color-accent]

            transition-colors

            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <RefreshIcon
            className={`
              w-4
              h-4

              ${isLoading ? "animate-spin" : ""}
            `}
          />
          Actualizar
        </button>
      </div>

      {/* TABLA */}
      <div className="w-full overflow-x-auto">
        <table
          className="
            w-full
            min-w-[760px]

            text-left
            text-sm
          "
        >
          <thead
            className="
              bg-[--color-background]

              border-b
              border-[--color-border]
            "
          >
            <tr>
              <th className="px-5 md:px-6 py-3 font-semibold text-[--color-text-secondary]">
                Tabla
              </th>

              <th className="px-5 md:px-6 py-3 font-semibold text-[--color-text-secondary]">
                Nombre de archivo
              </th>

              <th className="px-5 md:px-6 py-3 font-semibold text-[--color-text-secondary]">
                Última carga
              </th>

              <th className="px-5 md:px-6 py-3 font-semibold text-[--color-text-secondary]">
                Hora
              </th>

              <th className="px-5 md:px-6 py-3 font-semibold text-[--color-text-secondary]">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : logs && logs.length > 0 ? (
              logs.map((log, index) => (
                <tr
                  key={index}
                  className="
                      border-b
                      last:border-b-0

                      border-[--color-border]

                      hover:bg-[--color-background]

                      transition-colors
                    "
                >
                  <td className="whitespace-nowrap px-5 md:px-6 py-4 font-semibold text-[--color-text-primary]">
                    {log.dataset}
                  </td>

                  <td className="whitespace-nowrap px-5 md:px-6 py-4 text-[--color-text-secondary]">
                    {log.file_name}
                  </td>

                  <td className="whitespace-nowrap px-5 md:px-6 py-4 text-[--color-text-secondary]">
                    {formatDate(log.timestamp)}
                  </td>

                  <td className="whitespace-nowrap px-5 md:px-6 py-4 text-[--color-text-secondary]">
                    {formatTime(log.timestamp)}
                  </td>

                  <td className="whitespace-nowrap px-5 md:px-6 py-4">
                    <div
                      className={`
                          w-fit

                          flex
                          items-center
                          gap-1.5

                          px-2.5
                          py-1.5

                          rounded-full

                          text-xs
                          font-semibold

                          ${
                            log.severity === "ERROR"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                    >
                      {log.severity === "ERROR" ? (
                        <Error className="w-4 h-4" />
                      ) : (
                        <Ok className="w-4 h-4" />
                      )}

                      {log.severity === "ERROR" ? "Error" : "Exitoso"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="
                    p-8
                    md:p-12

                    text-center

                    text-[--color-text-secondary]
                  "
                >
                  No se encontraron registros recientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
