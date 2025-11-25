import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- 1. Definimos las Props que necesita el componente ---
interface FileData {
  fileName?: string;
  headers?: string[];
  rows?: Record<string, any>[];
  isEmpty?: boolean;
}

interface Breadcrumbs {
  envId?: string;
  bucketName?: string;
  productName?: string;
  tableName?: string;
}

interface DataGridPreviewProps {
  loading?: boolean;
  file?: FileData;
  breadcrumbs?: Breadcrumbs;
}

// --- 2. Creamos el Componente de Presentación ---
export default function DataGridPreview({ loading, file, breadcrumbs }: DataGridPreviewProps) {
  const headers = file?.headers || [];
  const rows = file?.rows || [];

  return (
    <div className="w-full text-left p-10">
      {/* Encabezado con el estilo de la marca */}
      <div className="mb-8">
        <h1 className="text-3xl text-[--color-naranjo] font-bold">
          {loading ? <Skeleton width={400} /> : "Vista Previa de Datos"}
        </h1>

        {/* Info del Archivo y Breadcrumbs */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Archivo:</span>
            {loading ? <Skeleton width={200} /> : (
              <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-orange-200">
                {file?.fileName || "N/A"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400">
            {loading ? <Skeleton width={500} /> : (
              <>
                <span>{breadcrumbs?.envId}</span>
                <span>/</span>
                <span>{breadcrumbs?.bucketName}</span>
                <span>/</span>
                <span>{breadcrumbs?.productName}</span>
                <span>/</span>
                <span className="font-bold text-gray-600">{breadcrumbs?.tableName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor principal para la tabla o sus estados */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          // --- Estado de Carga (Esqueleto de la tabla) ---
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-6 py-4"><Skeleton width={20} /></th>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <th key={i} className="px-6 py-4"><Skeleton width={120} /></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={20} /></td>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><Skeleton /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : file?.isEmpty ? (
          // --- Estado Vacío ---
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No se encontró un archivo para previsualizar.</p>
            <p className="text-sm mt-2 text-gray-400">Esta tabla está lista para su primera carga de datos.</p>
          </div>
        ) : (
          // --- Estado con Datos (Tabla Estilizada) ---
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 w-10 font-bold text-gray-400">#</th>
                  {headers.map((header, idx) => (
                    <th key={idx} className="px-6 py-3 whitespace-nowrap uppercase tracking-wider font-semibold text-[--color-naranjo] opacity-80">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{rowIdx + 1}</td>
                    {headers.map((col, colIdx) => (
                      <td key={`${rowIdx}-${colIdx}`} className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {row[col]?.toString() || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500">
              Mostrando los primeros {rows.length} registros del archivo.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}