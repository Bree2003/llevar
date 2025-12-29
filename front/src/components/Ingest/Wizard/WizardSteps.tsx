import { useState } from "react";
import {
  AnalysisStep1Data,
  AnalysisStep2Data,
  AnalysisStep3Data,
} from "models/Ingest/analysis-model";
import { ReactComponent as Danger } from "components/Global/Icons/danger.svg";
import { ReactComponent as Warning } from "components/Global/Icons/warning.svg";

// --- HELPERS ---
const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="grid grid-cols-4 py-1.5 border-b border-gray-100 last:border-0">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="col-span-3 text-gray-900 text-sm font-semibold">
      {value || "-"}
    </span>
  </div>
);

// --- STEP 1: CONFIRMACIÓN ---
export const Step1Confirmation = ({ data }: { data: AnalysisStep1Data }) => {
  if (!data) return <div className="p-4 text-center">Error al cargar datos</div>;
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        Resumen del Archivo
      </h3>
      <DetailRow label="Nombre" value={data.nombre_archivo} />
      <DetailRow label="Tamaño" value={data.tamano} />
      <DetailRow label="Tipo" value={data.tipo_archivo} />
      <DetailRow label="Fecha Carga" value={data.fecha_de_carga} />
      <DetailRow label="Hora Carga" value={data.hora_de_carga} />
    </div>
  );
};

// --- STEP 2: ESTRUCTURA ---
export const Step2Structure = ({ data }: { data: AnalysisStep2Data }) => {
  const [tab, setTab] = useState<"columns" | "preview">("columns");

  if (!data)
    return <div className="p-4 text-center">Cargando estructura...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded text-center">
          <span className="block text-xs text-gray-500">Columnas</span>
          <span className="text-xl font-bold text-blue-700">
            {data.numero_columnas}
          </span>
        </div>
        <div className="bg-blue-50 p-3 rounded text-center">
          <span className="block text-xs text-gray-500">Registros</span>
          <span className="text-xl font-bold text-blue-700">
            {data.numero_registros}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-3">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "columns"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("columns")}
        >
          Columnas
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "preview"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("preview")}
        >
          Vista Previa
        </button>
      </div>

      <div className="flex-grow overflow-y-auto border rounded bg-gray-50 p-2 max-h-60">
        {tab === "columns" ? (
          <ul className="space-y-2">
            {data.columnas_encontradas.map((col, idx) => (
              <li
                key={idx}
                className="flex justify-between bg-white p-2 rounded shadow-sm text-sm"
              >
                <span className="font-medium text-gray-700">{col.nombre}</span>
                <span className="bg-gray-200 px-2 py-0.5 rounded text-xs text-gray-600">
                  {col.tipo}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <table className="min-w-full text-xs bg-white">
            <thead>
              <tr className="bg-gray-100">
                {data.columnas_encontradas.map((c) => (
                  <th key={c.nombre} className="p-2 text-left">
                    {c.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.vista_previa.map((row, idx) => (
                <tr key={idx} className="border-t">
                  {data.columnas_encontradas.map((c) => (
                    <td key={c.nombre} className="p-2 truncate max-w-[100px]">
                      {row[c.nombre]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- STEP 3: VALIDACIÓN (tablas existentes) ---
export const Step3Validation = ({ data }: { data: any }) => {
  if (!data) return <p>Cargando...</p>;

  const errores = data.bloqueantes || [];
  const alertas = data.alertas || [];
  const isValid = errores.length === 0 && alertas.length === 0;

  return (
    <div className="h-full overflow-y-auto pr-2">
      {data.validado_contra && (
        <p className="text-xs text-gray-500 mb-4">
          Esquema: {data.validado_contra}
        </p>
      )}

      {/* 1. ERRORES BLOQUEANTES (ROJO) */}
      {errores.length > 0 && (
        <div className="mb-6">
          <h4 className="text-red-700 font-bold text-sm mb-2">
            Errores Bloqueantes (Impide Ingesta)
          </h4>
          <div className="space-y-2">
            {errores.map((err: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start p-3 text-sm bg-red-50 text-red-800 border-l-4 border-red-500 rounded-r-lg"
              >
                <span className="mr-2">🛑</span>
                <span>{err}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ALERTAS (AMARILLO) */}
      {alertas.length > 0 && (
        <div className="mb-6">
          <h4 className="text-yellow-700 font-bold text-sm mb-2">
            Advertencias (Permite Ingesta)
          </h4>
          <div className="space-y-2">
            {alertas.map((warn: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start p-3 text-sm bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 rounded-r-lg"
              >
                <Danger className="w-5 h-5 mr-2 shrink-0" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ÉXITO */}
      {isValid && (
        <div className="p-6 text-center bg-green-50 text-green-800 border border-green-200 rounded-lg mt-4">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-bold">Validación Exitosa</p>
          <p className="text-sm">
            El archivo cumple perfectamente con el esquema de la tabla destino.
          </p>
        </div>
      )}
    </div>
  );
};

// --- STEP 3: DOCUMENTACIÓN (tablas nuevas) ---
// wizardsteps.tsx

export const Step3NewTableDescription = ({ 
  columns, 
  metadata, 
  onTableDescChange, 
  onColumnDescChange 
}: { 
  columns: any[], 
  metadata: any,
  onTableDescChange: (v: string) => void,
  onColumnDescChange: (col: string, v: string) => void
}) => {
  return (
    <div className="h-full flex flex-col space-y-6 text-left">
      {/* 1. Descripción General (Arriba) */}
      <section className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block font-bold text-gray-800 mb-2">
          Descripción de la Tabla (BigQuery Metadata)
        </label>
        <textarea 
          value={metadata.description}
          onChange={(e) => onTableDescChange(e.target.value)}
          placeholder="Ej: Tabla maestra de clientes sincronizada desde el CRM mensual..."
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-orange-500 outline-none min-h-[80px]"
        />
      </section>

      {/* 2. Tabla de Columnas (Scrollable) */}
      <section className="flex-grow flex flex-col min-h-0">
        <label className="block font-bold text-gray-800 mb-2">
          Diccionario de Datos (Columnas)
        </label>
        <div className="overflow-hidden border border-gray-200 rounded-lg flex flex-col flex-grow bg-white">
          <div className="overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-1/4 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Columna</th>
                  <th className="w-1/6 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
                  <th className="w-auto px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Descripción / Definición</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 truncate">
                      {col.nombre}
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded">
                        {col.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={metadata.columnDescriptions[col.nombre] || ""}
                        onChange={(e) => onColumnDescChange(col.nombre, e.target.value)}
                        placeholder={`Definir ${col.nombre}...`}
                        className="w-full text-sm border-b border-transparent focus:border-orange-500 focus:ring-0 bg-transparent py-1 outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};