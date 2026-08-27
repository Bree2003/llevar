import { useEffect, useState, useCallback } from "react";
import { ReactComponent as Ok } from "components/Global/Icons/tick-circle.svg";
import { ReactComponent as Error } from "components/Global/Icons/close-circle.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

type Log = {
  dataset: string;
  file_name: string;
  timestamp: string;
  severity: string;
};

interface resumenProductoProps {
  productName: string;
}

export default function ResumenProducto({ productName }: resumenProductoProps) {
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { envId } = useParams<{ envId: string }>();

  const fetchLogs = useCallback(async () => {
    if (!productName) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logs/product/${productName}?limit=4`,
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
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [productName]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="px-6 py-4"><Skeleton width={120} /></td>
      <td className="px-6 py-4"><Skeleton width={200} /></td>
      <td className="px-6 py-4"><Skeleton width={80} /></td>
      <td className="px-6 py-4"><Skeleton width={60} /></td>
      <td className="px-6 py-4"><Skeleton width={70} /></td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"> 
      
        <div className="p-6 border-b border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
               <h2 className="text-lg font-semibold text-gray-800">Resumen de tablas</h2>
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="group flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg 
          hover:bg-orange-50 hover:text-[--color-naranjo] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Actualizar lista"
          >
          <RefreshIcon className={`w-4 h-4 transition-transform ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
          <span>Actualizar</span>
        </button>
          </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-semibold">Tabla</th>
              <th className="px-6 py-3 font-semibold">Nombre de archivo</th>
              <th className="px-6 py-3 font-semibold">Última carga</th>
              <th className="px-6 py-3 font-semibold">Hora</th>
              <th className="px-6 py-3 font-semibold">Estado</th>
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
                  className="border-b last:border-b-0 transition duration-300 ease-in-out hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-800">
                    {log.dataset}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                    {log.file_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                    {formatTime(log.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold w-fit
                      ${log.severity === "ERROR" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {log.severity === "ERROR" ? <Error className="w-4 h-4"/> : <Ok className="w-4 h-4"/>}
                      {log.severity === "ERROR" ? "Error" : "Exitoso"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500 italic">
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