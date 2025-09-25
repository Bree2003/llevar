import { useEffect, useState } from "react";

type LogEntry = {
  dataset?: string;
  timestamp?: string;
};

export default function QuickAccess() {
  const [userLogs, setUserLogs] = useState<LogEntry[]>([]);

  const fetchUserLogs = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/logs/user/bsandovalh",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener logs: ${response.statusText}`);
      }

      const data = await response.json();
      setUserLogs(data.logs || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserLogs();
  }, []);

  return (
    <div className="w-[420px] bg-[--color-gris-claro] p-5 text-left h-full">
      <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
      <hr className="border-black mb-4" />
      <h3 className="text-xl font-semibold mb-4">Favoritos</h3>
      <div className="p-2 bg-white rounded-xl mb-4 flex flex-col gap-2">
        <p className="hover:bg-[--color-gris-claro]">Carga Avisos</p>
        <p className="hover:bg-[--color-gris-claro]">Maestro Fert</p>
        <p className="hover:bg-[--color-gris-claro]">Merma Semanal</p>
        <p className="hover:bg-[--color-gris-claro]">Maestro Insumos</p>
        <p className="hover:bg-[--color-gris-claro]">Maestro OF</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Tus últimas modificaciones</h3>
      <div className="p-2 bg-white rounded-xl flex flex-col gap-2">
        {userLogs.length === 0 ? (
          <p className="text-sm text-[--color-gris-oscuro]">
            Cargando modificaciones recientes.
          </p>
        ) : (
          userLogs.slice(0, 5).map((log, index) => (
            <p
              key={index}
              className="hover:bg-[--color-gris-claro] leading-none"
            >
              {log.dataset || "Sin dataset"} <br />
              <span className="text-sm text-[--color-gris-oscuro]">
                Fecha:{" "}
                {log.timestamp
                  ? new Date(log.timestamp).toLocaleString()
                  : "Sin fecha"}
              </span>
            </p>
          ))
        )}
      </div>
    </div>
  );
}
