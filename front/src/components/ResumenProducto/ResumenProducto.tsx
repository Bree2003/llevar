import { useEffect, useState } from "react";
import { ReactComponent as Ok } from "assets/svg/tick-circle.svg";
import { ReactComponent as Error } from "assets/svg/close-circle.svg";
import { ReactComponent as ArrowLeft } from "assets/svg/arrow-left.svg";

type Log = {
  dataset: string;
  file_name: string;
  timestamp: string;
  severity: string;
};

export default function ResumenProducto() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetchLogsByProduct("programa_fabricación");
  }, []);

  const fetchLogsByProduct = async (product: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/logs/product/${product}?limit=5`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  return (
    <div>
      <div>
        <h2 className="font-bold text-left text-2xl mb-10">
          Resumen Programa de Fabricación
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
              {logs.map((log, index) => (
                <tr
                  key={index}
                  className="border-b transition duration-300 ease-in-out hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {log.dataset}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {log.file_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {formatTime(log.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 flex items-center gap-1">
                    {log.severity === "ERROR" ? <Error /> : <Ok />}
                    {log.severity === "ERROR" ? "Error" : "Ok"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-right flex justify-end">
          <button className="text-[--color-naranjo] flex gap-1">
            Ver últimas modificaciones <ArrowLeft />
          </button>
        </div>
      </div>
    </div>
  );
}
