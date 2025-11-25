import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// El modelo de una tabla individual
interface Table {
  id: string;
  label: string;
}

interface ProductSidebarProps {
  productName?: string;
  tables: Table[];
  loading?: boolean;
  onSelectTable: (tableId: string) => void; // Función para manejar el clic
}

const formatName = (text: string = "") => {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ProductSidebar({ productName, tables, loading, onSelectTable }: ProductSidebarProps) {
  return (
    <div className="w-[300px] bg-[--color-gris-claro] p-6 text-left flex-shrink-0 h-screen overflow-y-auto">
      {loading ? (
        // Estado de carga con esqueletos
        <div>
          <div className="flex gap-3 items-center mb-4">
            <Skeleton circle width={32} height={32} />
            <Skeleton height={28} width={180} />
          </div>
          <hr className="border-black mb-4" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} height={24} />
            ))}
          </div>
        </div>
      ) : (
        // Contenido real
        <>
          <div className="flex gap-3 items-center mb-4">
            {/* <TableIcon className="w-8 h-8 text-[--color-naranjo]" /> */}
            <h2 className="text-2xl text-[--color-naranjo] font-semibold">
              {formatName(productName)}
            </h2>
          </div>
          <hr className="border-black mb-4" />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-gray-500 mb-2">TABLAS DISPONIBLES</p>
            {tables.length > 0 ? (
              tables.map(table => (
                <div
                  key={table.id}
                  onClick={() => onSelectTable(table.id)}
                  className="text-lg p-2 rounded-md font-semibold hover:text-white hover:bg-[--color-gris-oscuro] cursor-pointer transition-colors"
                >
                  {table.label}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm p-2">No hay tablas en este producto.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}