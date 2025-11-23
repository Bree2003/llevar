import { useEffect, useState } from "react";
import { ReactComponent as Ok } from "components/Global/Icons/tick-circle.svg";
import { ReactComponent as Error } from "components/Global/Icons/close-circle.svg";
import { ReactComponent as ArrowLeft } from "components/Global/Icons/arrow-left.svg";

// --- NOVEDAD: Importaciones para el Skeleton ---
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Log = {
  dataset: string;
  file_name: string;
  timestamp: string;
  severity: string;
};

interface resumenProductoProps {
  productName: string;
}

// --- NOVEDAD: Helper para formatear el nombre del producto en el título ---
const formatProductName = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ResumenProducto( {productName}: resumenProductoProps) {
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Se renombra la función para mayor claridad, pero la lógica es la misma.
    const fetchLogs = async (product: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://data-products-backend-dev-697719423009.us-east4.run.app/api/logs/product/${product}?limit=4`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setLogs(data.logs || []);
      } catch (error) {
        console.error("Error al obtener los logs:", error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs(productName);
  }, [productName]); // Se añade productName a las dependencias de useEffect

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };



  // --- NOVEDAD: Componente interno para una fila de esqueleto ---
  // Esto mantiene el JSX de la tabla más limpio.
  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="whitespace-nowrap px-6 py-4"><Skeleton width={120} /></td>
      <td className="whitespace-nowrap px-6 py-4"><Skeleton width={200} /></td>
      <td className="whitespace-nowrap px-6 py-4"><Skeleton width={80} /></td>
      <td className="whitespace-nowrap px-6 py-4"><Skeleton width={60} /></td>
      <td className="whitespace-nowrap px-6 py-4"><Skeleton width={70} /></td>
    </tr>
  );

  return (
    <div>
      <div>
        <h2 className="font-bold text-left text-2xl mb-10">
          {/* --- NOVEDAD: Esqueleto para el título --- */}
          {isLoading ? <Skeleton width={400} /> : `Resumen ${formatProductName(productName)}`}
        </h2>
        <div className="overflow-x-auto mb-3">
          <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium bg-gray-100">
              <tr>
                <th className="px-6 py-4">Dataset</th>
                <th className="px-6 py-4">Nombre de archivo</th>
                <th className="px-6 py-4">Última carga</th>
                <th className="px-6 py-4">Hora</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // --- NOVEDAD: Muestra 4 filas de esqueleto mientras carga ---
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : logs && logs.length > 0 ? (
                // ESTADO 2: Carga finalizada Y tenemos logs
                logs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b transition duration-300 ease-in-out hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{log.dataset}</td>
                    <td className="whitespace-nowrap px-6 py-4">{log.file_name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{formatDate(log.timestamp)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{formatTime(log.timestamp)}</td>
                    <td className="whitespace-nowrap px-6 py-4 flex items-center gap-1">
                      {log.severity === "ERROR" ? <Error /> : <Ok />}
                      {log.severity === "ERROR" ? "Error" : "Ok"}
                    </td>
                  </tr>
                ))
              ) : (
                // ESTADO 3: Carga finalizada PERO no hay logs
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No se encontraron registros para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-right flex justify-end">
          {/* --- NOVEDAD: Esqueleto para el botón --- */}
          {isLoading ? (
            <Skeleton width={210} height={24}/>
          ) : (
            <button className="text-[--color-naranjo] flex gap-1">
              Ver últimas modificaciones <ArrowLeft />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}