import { useState } from "react";
import {
  AnalysisStep1Data,
  AnalysisStep2Data,
  AnalysisStep3Data,
} from "models/Ingest/analysis-model";
import { ReactComponent as Danger } from "components/Global/Icons/danger.svg";
import { ReactComponent as Warning } from "components/Global/Icons/warning.svg";
import AlertMessage from "components/UI/AlertMessage";

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
  if (!data)
    return <div className="p-4 text-center">Error al cargar datos</div>;
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        Resumen del archivo
      </h3>
      <DetailRow label="Nombre" value={data.nombre_archivo} />
      <DetailRow label="Tamaño" value={data.tamano} />
      <DetailRow label="Tipo" value={data.tipo_archivo} />
      <DetailRow label="Fecha carga" value={data.fecha_de_carga} />
      <DetailRow label="Hora carga" value={data.hora_de_carga} />
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
          Vista previa
        </button>
      </div>

      <div className="flex-grow overflow-y-auto border rounded bg-gray-50 p-2 h-full max-h-60">
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

      <AlertMessage variant="compact" className="mt-8">
        <span>
          Hemos ajustado los nombres de las columnas eliminando símbolos y
          caracteres especiales (ñ, -, $, etc.). Esto garantiza que tus datos se
          procesen correctamente.
        </span>
      </AlertMessage>
    </div>
  );
};

const parseValidationMessage = (message: string) => {
  // 1. Caso: Columnas que sobran (Están en el archivo pero no en BQ)
  if (message.includes("columnas que no existen en BigQuery")) {
    const parts = message.split(":");
    const columnsStr = parts[1] || "";
    return {
      type: "EXTRA_COLUMNS",
      title: "Columnas inesperadas",
      description:
        "Estas columnas están en tu archivo pero NO existen en la tabla de BigQuery.",
      columns: columnsStr
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };
  }

  // 2. Caso: Columnas que faltan (Están en BQ pero no en el archivo)
  if (message.includes("Faltan columnas requeridas")) {
    const parts = message.split(":");
    const columnsStr = parts[1] || "";
    return {
      type: "MISSING_COLUMNS",
      title: "Columnas faltantes",
      description:
        "Estas columnas son OBLIGATORIAS en BigQuery y no vienen en tu archivo.",
      columns: columnsStr
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };
  }

  // 3. Caso: Cualquier otro error genérico
  return { type: "GENERIC", message };
};

// --- STEP 3: VALIDACIÓN (Tablas Existentes) ---
export const Step3Validation = ({ data }: { data: any }) => {
  if (!data)
    return (
      <div className="p-10 text-center text-gray-400">
        Cargando validaciones...
      </div>
    );

  const errores = data.bloqueantes || [];
  const alertas = data.alertas || [];
  const isValid = errores.length === 0 && alertas.length === 0;

  // Procesamos los errores crudos para convertirlos en objetos estructurados
  const parsedErrors = errores.map(parseValidationMessage);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto px-1 space-y-6 custom-scrollbar">
        {/* CASO: ÉXITO */}
        {isValid && (
          <div className="flex flex-col items-center justify-center h-48 bg-green-50/50 border-2 border-dashed border-green-200 rounded-xl">
            <div className="text-4xl mb-2">✅</div>
            <p className="font-bold">Validación Exitosa</p>
            <p className="text-green-600 text-sm">
              El archivo cumple con los requisitos para ser ingestada.
            </p>
          </div>
        )}

        {/* CASO: ERRORES (Grid de 2 columnas) */}
        {errores.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-red-700">
              <h4 className="font-bold text-sm uppercase tracking-wide">
                Errores Bloqueantes
              </h4>
              <div className="h-px bg-red-200 flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsedErrors.map((err: any, idx: number) => {
                // Renderizado para error genérico (texto plano)
                if (err.type === "GENERIC") {
                  return (
                    <div
                      key={idx}
                      className="md:col-span-2 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-red-800 text-sm shadow-sm"
                    >
                      {err.message}
                    </div>
                  );
                }

                // Renderizado para errores de columnas (Tarjetas Visuales)
                const isMissing = err.type === "MISSING_COLUMNS";

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border shadow-sm flex flex-col h-full overflow-hidden
                    ${isMissing ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}
                  >
                    <div
                      className={`px-4 py-3 border-b ${isMissing ? "border-red-200 bg-red-100/50" : "border-orange-200 bg-orange-100/50"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {isMissing ? "🛑" : "⚠️"}
                        </span>
                        <h5
                          className={`font-bold text-sm ${isMissing ? "text-red-800" : "text-orange-800"}`}
                        >
                          {err.title}
                        </h5>
                      </div>
                      <p
                        className={`text-xs ${isMissing ? "text-red-600" : "text-orange-700"}`}
                      >
                        {err.description}
                      </p>
                    </div>

                    <div className="p-4 bg-white/50 flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {err.columns.map((col: string, cIdx: number) => (
                          <span
                            key={cIdx}
                            className={`text-xs px-2 py-1 rounded font-mono font-medium border shadow-sm
                                    ${
                                      isMissing
                                        ? "bg-white text-red-600 border-red-200"
                                        : "bg-white text-orange-600 border-orange-200"
                                    }`}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CASO: ALERTAS */}
        {alertas.length > 0 && (
          <div className="mt-4">
            <h4 className="text-yellow-700 font-bold text-sm mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span> Advertencias (No bloqueantes)
            </h4>
            <div className="space-y-2">
              {alertas.map((warn: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-yellow-50 text-yellow-800 border border-yellow-200 p-3 rounded-lg text-sm flex items-start shadow-sm"
                >
                  <span className="mr-2 font-bold">•</span>
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// --- STEP 3: DOCUMENTACIÓN (Tablas Nuevas) ---
export const Step3NewTableDescription = ({
  columns,
  metadata,
  onTableDescChange,
  onColumnDescChange,
}: {
  columns: any[];
  metadata: any;
  onTableDescChange: (v: string) => void;
  onColumnDescChange: (col: string, v: string) => void;
}) => {
  return (
    <div className="h-full flex flex-col space-y-6 text-left">
      {/* 1. Descripción General (Arriba) */}
      <section className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block font-bold text-gray-800 mb-2">
          Descripción de la Tabla (BigQuery Metadata){" "}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          required
          value={metadata.description}
          onChange={(e) => onTableDescChange(e.target.value)}
          placeholder="Ej: Tabla maestra de clientes sincronizada desde el CRM mensual... (Requerido)"
          className={`w-full border rounded-md p-2 text-sm focus:ring-orange-500 outline-none min-h-[80px] ${
            !metadata.description ? "border-gray-300" : "border-gray-300"
          }`}
        />
        {!metadata.description && (
          <p className="text-xs text-red-400 mt-1">
            Este campo es obligatorio.
          </p>
        )}
      </section>
      {/* 2. Tabla de Columnas (Scrollable) */}
      <section className="flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-end mb-2">
          <label className="block font-bold text-gray-800">
            Diccionario de Datos (Columnas)
          </label>
          <span className="text-xs text-gray-500">
            <span className="text-red-500 font-bold">*</span> Todos los campos
            son requeridos
          </span>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-lg flex flex-col flex-grow bg-white">
          <div className="overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-1/4 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                    Columna
                  </th>
                  <th className="w-1/6 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="w-auto px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                    Descripción / Definición{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </th>
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
                        onChange={(e) =>
                          onColumnDescChange(col.nombre, e.target.value)
                        }
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
