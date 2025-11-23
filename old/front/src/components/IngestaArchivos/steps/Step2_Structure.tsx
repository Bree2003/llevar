// src/components/IngestaArchivos/steps/Step2_Structure.tsx
import { useState } from "react";
import { ReactComponent as ArrowLeft } from "assets/svg/arrow-square-left.svg";
import { ReactComponent as ArrowRight } from "assets/svg/arrow-square-right.svg";

export default function Step2Structure({ data }: { data: any }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!data) return <p>Cargando...</p>;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="text-left">
      <h3 className="font-bold text-2xl mb-4 text-gray-700">
        Revisión de Estructura
      </h3>
      <hr className="my-4 border-black" />
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col">
          <p className=" text-sm font-medium">
            Número de Columnas:{" "}
            <span className="font-bold text-black">{data.numero_columnas}</span>
          </p>
          <p className=" text-sm font-medium">
            Número de Registros:{" "}
            <span className="font-bold text-black">
              {data.numero_registros}
            </span>
          </p>

          <p
            className="flex items-center gap-2 cursor-pointer text-sm font-medium"
            onClick={() => toggleSection("columnas")}
          >
            Columnas Encontradas{" "}
            {expandedSection === "columnas" ? <ArrowLeft /> : <ArrowRight />}
          </p>

          <p
            className="flex items-center gap-2 cursor-pointer text-sm font-medium"
            onClick={() => toggleSection("vista")}
          >
            Vista Previa de la Tabla{" "}
            {expandedSection === "vista" ? <ArrowLeft /> : <ArrowRight />}
          </p>
        </div>

        {expandedSection === "columnas" && (
          <div className="text-sm col-span-2 flex justify-center">
            <div className="inline-block">
              <h4 className="font-semibold mb-2 text-center">Columnas</h4>
              <ul className="overflow-y-auto p-2 rounded border flex flex-col w-full min-w-[300px] gap-3 max-h-[280px]">
                {data.columnas_encontradas.map((col: any) => (
                  <li
                    key={col.nombre}
                    className="flex justify-between items-center"
                  >
                    {col.nombre}:{" "}
                    <span className="text-xs bg-white py-2 w-14 rounded-lg text-center">
                      {col.tipo}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {expandedSection === "vista" && (
          <div className="col-span-2 mt-4">
            <h4 className="font-semibold mb-2 text-sm">
              Vista Previa (Primeras 5 filas):
            </h4>
            <div className="overflow-x-auto text-xs border rounded">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data.vista_previa[0] || {}).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.vista_previa.map((row: any, i: number) => (
                    <tr key={i}>
                      {Object.values(row).map((val: any, j: number) => (
                        <td key={j} className="px-4 py-2 whitespace-nowrap">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
