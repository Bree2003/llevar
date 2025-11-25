import { ReactComponent as Calendar } from "components/Global/Icons/calendar.svg";
import { Link } from "react-router-dom";

// --- NOVEDAD: Importaciones para el Skeleton ---
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// 1. Definimos las props, incluyendo la nueva prop 'loading'
interface MenuLateralProps {
  activeProduct: string;
  datasets: string[];
  loading?: boolean; // La prop para controlar el estado de carga
}

// 2. Helper para formatear los nombres (sin cambios)
const formatName = (text: string) => {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function MenuLateral({ activeProduct, datasets, loading }: MenuLateralProps) {
  return (
    <div className="w-[280px] bg-[--color-gris-claro] p-5 text-left flex-shrink-0">
      {/* --- NOVEDAD: Lógica de renderizado condicional --- */}
      {loading ? (
        // A. Si está cargando, muestra los esqueletos
        <div>
          {/* Esqueleto para el Título y el Icono */}
          <div className="flex gap-3 items-center mb-4">
            <Skeleton circle width={32} height={32} />
            <Skeleton height={28} width={180} />
          </div>
          <hr className="border-black mb-4" />
          {/* Esqueleto para la lista de datasets */}
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} height={24} />
            ))}
          </div>
        </div>
      ) : (
        // B. Si no está cargando, muestra el contenido real
        <>
          {/* Título dinámico con el producto activo */}
          <div className="flex gap-3 items-center mb-4">
            <Calendar className="w-8 h-8 text-[--color-naranjo]" />
            <h2 className="text-2xl text-[--color-naranjo] font-semibold">
              {formatName(activeProduct)}
            </h2>
          </div>

          <hr className="border-black mb-4" />

          {/* Lista de enlaces a partir de los 'datasets' */}
          <div className="flex flex-col gap-4">
            {datasets.length > 0 ? (
              datasets.map(dataset => (
                <Link
                  key={dataset}
                  to="#" // La URL de destino debería ser dinámica
                  className="text-xl font-semibold hover:text-white hover:bg-[--color-gris-oscuro]"
                >
                  {formatName(dataset.replace('.parquet', ''))}
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No hay datasets.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}