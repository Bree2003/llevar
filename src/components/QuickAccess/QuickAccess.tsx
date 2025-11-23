import { useEffect, useState } from "react";
// --- NOVEDAD: Importaciones para el Skeleton ---
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type LogEntry = {
  dataset?: string;
  timestamp?: string;
};

// --- NOVEDAD: Componente para el esqueleto de una entrada de log ---
// Ayuda a mantener el JSX principal más limpio y es reutilizable.
const LogEntrySkeleton = () => (
  <div className="leading-none">
    {/* Esqueleto para el nombre del dataset */}
    <Skeleton width={`70%`} />
    {/* Esqueleto para la fecha */}
    <Skeleton width={`50%`} height={12} style={{ marginTop: '4px' }}/>
  </div>
);


export default function QuickAccess() {
  const [userLogs, setUserLogs] = useState<LogEntry[]>([]);
  // --- NOVEDAD: Estado para controlar la carga ---
  const [loading, setLoading] = useState(true);

  const fetchUserLogs = async () => {
    // Se activa el estado de carga antes de la llamada
    setLoading(true);
    try {
      const response = await fetch(
        "https://data-products-backend-dev-697719423009.us-east4.run.app/api/logs/user/bsandovalh",
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
      // Opcional: podrías querer limpiar los logs si hay un error
      setUserLogs([]);
    } finally {
      // Se desactiva la carga cuando la operación termina (éxito o error)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLogs();
  }, []);

  return (
    <div className="w-[420px] bg-[--color-gris-claro] p-5 text-left h-full">

      {/* --- NOVEDAD: Renderizado condicional para la sección de modificaciones --- */}
      {loading ? (
        // 1. Muestra los esqueletos mientras carga
        <>
          <h3 className="text-xl font-semibold mb-4">
            <Skeleton width={250} />
          </h3>
          <div className="p-2 bg-white rounded-xl flex flex-col gap-2">
            {/* Repetimos el esqueleto 5 veces para simular la lista */}
            {Array.from({ length: 5 }).map((_, index) => (
              <LogEntrySkeleton key={index} />
            ))}
          </div>
        </>
      ) : (
        // 2. Muestra el contenido real cuando la carga ha terminado
        <>
          <h3 className="text-xl font-semibold mb-4">Tus últimas modificaciones</h3>
          <div className="p-2 bg-white rounded-xl flex flex-col gap-2">
            {userLogs.length === 0 ? (
              // Mensaje si no hay logs después de cargar
              <p className="text-sm text-[--color-gris-oscuro]">
                No se encontraron modificaciones recientes.
              </p>
            ) : (
              // Mapea y muestra los logs reales
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
        </>
      )}
    </div>
  );
}