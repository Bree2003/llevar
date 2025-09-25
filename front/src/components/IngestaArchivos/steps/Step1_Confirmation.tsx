// src/components/IngestaArchivos/steps/Step1_Confirmation.tsx
const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="grid grid-cols-4 py-1.5">
    <span className="font-medium ">{label}:</span>
    <span className="col-span-2 text-gray-800 text-sm">{value || "-"}</span>
  </div>
);

export default function Step1Confirmation({ data }: { data: any }) {
  if (!data) return <p>Cargando...</p>;

  return (
    <div className="text-left">
      <h3 className="font-bold text-2xl mb-4 text-gray-700">
        Confirmación de Archivo
      </h3>
      <hr className="my-4 border-black" />
      <DetailRow label="Producto de dato" value={data.producto_dato} />
      <DetailRow label="Dataset destino" value={data.dataset_destino} />
      <DetailRow label="Nombre archivo" value={data.nombre_archivo} />
      <DetailRow label="Usuario" value={data.usuario} />
      <DetailRow label="Tamaño" value={data.tamano} />
      <DetailRow label="Fecha de carga" value={data.fecha_de_carga} />
      <DetailRow label="Hora de carga" value={data.hora_de_carga} />
      <DetailRow label="Tipo de archivo" value={data.tipo_archivo} />
    </div>
  );
}
