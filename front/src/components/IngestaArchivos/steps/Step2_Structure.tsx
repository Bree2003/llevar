// src/components/IngestaArchivos/steps/Step2_Structure.tsx
export default function Step2Structure({ data }: { data: any }) {
    if (!data) return <p>Cargando...</p>;
    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-gray-700">Revisión de Estructura</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-gray-500">Número de Columnas: <span className="font-bold text-black">{data.numero_columnas}</span></p>
                    <p className="text-sm text-gray-500">Número de Registros: <span className="font-bold text-black">{data.numero_registros}</span></p>
                </div>
                <div className="text-sm">
                    <h4 className="font-semibold mb-2">Columnas Encontradas:</h4>
                    <ul className="h-40 overflow-y-auto bg-gray-50 p-2 rounded border">
                        {data.columnas_encontradas.map((col: any) => (
                            <li key={col.nombre}>{col.nombre} <span className="text-xs text-gray-400">({col.tipo})</span></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-4">
                <h4 className="font-semibold mb-2 text-sm">Vista Previa (Primeras 5 filas):</h4>
                <div className="overflow-x-auto text-xs border rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>{Object.keys(data.vista_previa[0] || {}).map(key => <th key={key} className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">{key}</th>)}</tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.vista_previa.map((row: any, i: number) => (
                                <tr key={i}>{Object.values(row).map((val: any, j: number) => <td key={j} className="px-4 py-2 whitespace-nowrap">{val}</td>)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}