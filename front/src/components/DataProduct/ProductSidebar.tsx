import { MouseEventHandler } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useParams } from 'react-router-dom';

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
  onBack: MouseEventHandler<HTMLButtonElement>;
}



export default function ProductSidebar({ productName, tables, loading, onSelectTable, onBack }: ProductSidebarProps) {
    // 2. Obtener el parámetro 'envid' de la URL
  const { envId } = useParams<{ envId: string }>(); 
  console.log("env id:", envId)

      // Esta función extrae las siglas del módulo (ej: "mm") y las formatea
const getSapModuleLabel = (bucketName: string): string => {
  // Asumiendo formato: raw-dev-ddo-[MODULO]-bucket
  const parts = bucketName.split('-');
  
  // El código suele estar en la posición 3 (índice 3)
  // raw(0) - dev(1) - ddo(2) - mm(3) - bucket(4)
  const code = parts[3]; 

  if (code && code.length === 2) {
    return `Módulo ${code.toUpperCase()}`;
  }
  
  // Si no cumple el formato, devolvemos el nombre original o una limpieza básica
  return bucketName;
};

const formatLabel = (text: string): string => {
  if (!text) return "";

  // 1. Regla: Si tiene exactamente 3 letras, todo a mayúsculas (ej: MTS, SAP)
  if (text.length === 3) {
    return text.toUpperCase();
  }

  // 2. Reemplazamos guiones por espacios
  const cleanText = text.replace(/-/g, ' ');

  // 3. Convertimos a Title Case (respetando conectores en minúscula)
  const connectors = ['de', 'del', 'el', 'la', 'los', 'las', 'en', 'y', 'o'];
  
  return cleanText
    .split(' ')
    .map((word, index) => {
      // Siempre capitalizar la primera palabra, ignorar conectores en las siguientes
      if (index > 0 && connectors.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      // Capitalizar primera letra y el resto minúscula
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};
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
              {envId === "sap" ? getSapModuleLabel(productName || "") : formatLabel(productName || "")}
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
      <div className="pt-5 pl-10"> {/* Contenedor y separador */}
        <button
            onClick={onBack}
            className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm
                       text-orange-600 border border-orange-300
                       hover:bg-orange-50 hover:border-orange-400 hover:shadow-md
                       text-sm font-semibold transition-all duration-200 justify-start"
        >
            <span className="mr-2 text-lg">←</span> {/* Flecha un poco más grande */}
            Volver a {envId === "sap" ? "módulos" : "productos de datos"}
        </button>
    </div>
    </div>
  );
}