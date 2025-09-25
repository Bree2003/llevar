// src/components/IngestaArchivos/steps/Step1_Confirmation.tsx
const DetailRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-1.5 border-b">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="col-span-2 font-medium text-gray-800 text-sm">{value}</span>
    </div>
);
export default function Step1Confirmation({ data }: { data: any }) {
    if (!data) return <p>Cargando...</p>;
    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-gray-700">Confirmación de Archivo</h3>
            <DetailRow label="Nombre archivo" value={data.nombre_archivo} />
            <DetailRow label="Tamaño" value={data.tamano} />
            <DetailRow label="Tipo de archivo" value={data.tipo_archivo} />
            <DetailRow label="Fecha de carga" value={data.fecha_de_carga} />
            <DetailRow label="Hora de carga" value={data.hora_de_carga} />
        </div>
    );
}