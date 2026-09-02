import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type LogEntry = {
  dataset?: string;
  timestamp?: string;
};

const LogEntrySkeleton = () => (
  <div className="py-3">
    <Skeleton width="70%" height={18} />

    <Skeleton
      width="45%"
      height={13}
      style={{
        marginTop: "6px",
      }}
    />
  </div>
);

export default function QuickAccess() {
  const [userLogs, setUserLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserLogs = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logs/user/frontend-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error al obtener logs: ${response.statusText}`);
      }

      const data = await response.json();

      setUserLogs(data.logs || []);
    } catch (error) {
      console.error("Error:", error);
      setUserLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLogs();
  }, []);

  return (
    <aside
      className="
        w-full
        min-w-0
        bg-white
        border
        border-[--color-border]
        rounded-2xl
        p-5
        md:p-6
        h-fit

        xl:sticky
        xl:top-6
      "
    >
      {/* Header */}
      <div>
        <h2
          className="
            text-xl
            md:text-2xl
            font-bold
            text-[--color-text-primary]
          "
        >
          Tus últimas modificaciones
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-[--color-text-secondary]
          "
        >
          Revisa rápidamente las últimas fuentes de datos que has modificado.
        </p>
      </div>

      {/* Separador */}
      <div className="w-full border-t border-[--color-border] my-5" />

      {/* Contenido */}
      {loading ? (
        <div className="divide-y divide-[--color-border]">
          {Array.from({ length: 5 }).map((_, index) => (
            <LogEntrySkeleton key={index} />
          ))}
        </div>
      ) : userLogs.length === 0 ? (
        <div className="py-6 text-center">
          <p
            className="
              text-sm
              md:text-base
              text-[--color-text-secondary]
            "
          >
            No se encontraron modificaciones recientes.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {userLogs.slice(0, 5).map((log, index) => (
            <div
              key={`${log.dataset}-${log.timestamp}-${index}`}
              className={`
                py-3
                px-2
                rounded-lg
                transition-colors
                hover:bg-[--color-background]

                ${
                  index !== Math.min(userLogs.length, 5) - 1
                    ? "border-b border-[--color-border]"
                    : ""
                }
              `}
            >
              <p
                className="
                  text-sm
                  md:text-base
                  font-semibold
                  text-[--color-text-primary]
                  break-words
                "
              >
                {log.dataset || "Sin dataset"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  md:text-sm
                  text-[--color-text-secondary]
                "
              >
                {log.timestamp
                  ? new Date(log.timestamp).toLocaleString("es-CL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "Sin fecha"}
              </p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
