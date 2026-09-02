import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type LogEntry = {
  dataset?: string;
  timestamp?: string;
};

const LogEntrySkeleton = () => (
  <div className="leading-none">
    <Skeleton width="70%" />

    <Skeleton
      width="50%"
      height={12}
      style={{
        marginTop: "4px",
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
    <div
      className="
        w-[420px]

        bg-[--color-background]

        border-l
        border-[--color-border]

        p-5

        text-left

        h-full

        flex-shrink-0
      "
    >
      <h3
        className="
          text-xl
          font-semibold
          mb-4

          text-[--color-text-primary]
        "
      >
        Tus últimas modificaciones
      </h3>

      {loading ? (
        <div
          className="
            p-2

            bg-white

            border
            border-[--color-border]

            rounded-xl

            flex
            flex-col
            gap-2
          "
        >
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <LogEntrySkeleton key={index} />
          ))}
        </div>
      ) : (
        <div
          className="
            p-2

            bg-white

            border
            border-[--color-border]

            rounded-xl

            flex
            flex-col
            gap-2
          "
        >
          {userLogs.length === 0 ? (
            <p
              className="
                text-sm

                text-[--color-text-secondary]
              "
            >
              No se encontraron modificaciones recientes.
            </p>
          ) : (
            userLogs.slice(0, 5).map((log, index) => (
              <p
                key={index}
                className="
                      p-1

                      rounded-md

                      leading-none

                      text-[--color-text-primary]

                      hover:bg-[--color-accent-light]

                      transition-colors
                    "
              >
                {log.dataset || "Sin dataset"}

                <br />

                <span
                  className="
                        text-sm
                        text-[--color-text-secondary]
                      "
                >
                  Fecha:{" "}
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString("es-CL")
                    : "Sin fecha"}
                </span>
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}
