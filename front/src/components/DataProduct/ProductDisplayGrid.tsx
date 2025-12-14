import { ReactComponent as Calendar } from "components/Global/Icons/calendar.svg";
import { ReactComponent as Notification } from "components/Global/Icons/notification.svg";
import { ReactComponent as Mantenimiento } from "components/Global/Icons/mantenimiento.svg";
import { ReactComponent as Mermas } from "components/Global/Icons/mermas.svg";
import { ReactComponent as MTS } from "components/Global/Icons/mts.svg";
import { ReactComponent as Stock } from "components/Global/Icons/stock.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Product {
  id: string;
  label: string;
}

// --- CAMBIO 1: Añadimos 'bucketName' a las props ---
interface ProductDisplayGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (productId: string) => void;
  bucketName?: string; // Prop para recibir el nombre del bucket
}

const productDescriptions: Record<string, string> = {
  'programa_fabricacion': 'Plan o cronograma que organiza y controla la fabricación',
  'avisos_mantenimiento': 'M4 se refiere a los avisos de mantención correctiva',
  'mermas': 'Información que mide las mermas de los insumos secos',
  'mts': 'Sistema externo que almacena los tiempos de producción',
  'notificaciones': 'Registro semanal que consolida y valida la producción',
  'stock_materiales': 'Mantiene el stock existente y solicitado',
  'venta_exportacion': 'Contiene el stock SD y MM',
};

const productIcons: Record<string, React.ComponentType<any>> = {
  'programa_fabricacion': Calendar,
  'notificaciones': Notification,
  'avisos_mantenimiento': Mantenimiento,
  'mermas': Mermas,
  'mts': MTS,
  'stock_materiales': Stock,
  'venta_exportacion': Export,
};

const ProductCardSkeleton = () => (
    <div className="bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-40">
        <div className="flex items-center gap-5 mb-2 h-16">
            <Skeleton circle width={32} height={32} />
            <div className="flex-grow">
                <Skeleton height={28} width={`80%`} />
            </div>
        </div>
        <Skeleton count={2} />
    </div>
);

// --- CAMBIO 2: Movemos el header y el contenedor principal aquí ---
export default function ProductDisplayGrid({ products, loading, onProductClick, bucketName }: ProductDisplayGridProps) {
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
    <div className="w-full text-left p-10">
      {/* El header ahora vive dentro de este componente */}
      <div className="mb-10">
        <h1 className="text-3xl text-[--color-naranjo] font-bold">
          {loading ? <Skeleton width={400} /> : "Productos de Datos"}
        </h1>

      </div>

      <div className="flex flex-wrap gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : products.length > 0 ? (
          products.map((product) => {
            const iconKey = product.id;
            const IconComponent = productIcons[iconKey] || Calendar;
            const description = productDescriptions[iconKey] || 'Descripción no disponible.';
            return (
              <div
                key={product.id}
                onClick={() => onProductClick(product.id)}
                className="group bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-40 cursor-pointer"
              >
                <div className="flex items-center gap-5 mb-2 h-16">
                  <IconComponent className="w-8 h-8 text-[--color-naranjo]" />
                  <h2 className="text-2xl font-semibold transition-colors group-hover:text-[--color-naranjo]">
                    {formatLabel(product.label)}
                  </h2>
                </div>
                <p className="text-[--color-gris-oscuro]">{description}</p>
              </div>
            );
          })
        ) : (
          <div className="w-full py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No se encontraron productos en este bucket.</p>
          </div>
        )}
      </div>
    </div>
  );
}