// src/components/IngestaArchivos/steps/Step3_Validation.tsx
import { ReactComponent as Danger } from "assets/svg/danger.svg";

export default function Step3Validation({ data }: { data: any }) {
    if (!data) return <p>Cargando...</p>;
    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-gray-700">Validación de Datos</h3>
            {data.alertas && data.alertas.length > 0 ? (
                <div className="space-y-3">
                    {data.alertas.map((alerta: string, index: number) => (
                        <div key={index} className="flex items-start p-3 text-sm bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 rounded-r-lg">
                            <Danger />
                            <span>{alerta}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center bg-green-50 text-green-800 border border-green-200 rounded-lg">
                    <p>¡Validación completada! No se encontraron alertas. El archivo está listo para ser ingerido.</p>
                </div>
            )}
        </div>
    );
}