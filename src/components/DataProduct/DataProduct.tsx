import { ReactComponent as Calendar } from "components/Global/Icons/calendar.svg";
import { ReactComponent as Notification } from "components/Global/Icons/notification.svg";
import { ReactComponent as Mantenimiento } from "components/Global/Icons/mantenimiento.svg";
import { ReactComponent as Mermas } from "components/Global/Icons/mermas.svg";
import { ReactComponent as MTS } from "components/Global/Icons/mts.svg";
import { ReactComponent as Stock } from "components/Global/Icons/stock.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface DataProductProps {
  products: string[];
  loading?: boolean;
}

// Mapeo de nombres de producto a descripciones
const productDescriptions: Record<string, string> = {
  'programa_fabricacion': 'Plan o cronograma que organiza y controla la fabricación',
  'avisos_mantenimiento': 'M4 se refiere a los avisos de mantención correctiva',
  'mermas': 'Información que mide las mermas de los insumos secos',
  'mts': 'Sistema externo que almacena los tiempos de producción',
  'notificaciones': 'Registro semanal que consolida y valida la producción',
  'stock_materiales': 'Mantiene el stock existente y solicitado',
  'venta_exportacion': 'Contiene el stock SD y MM',
};

// Mapeo de nombres de producto a componentes de Icono
const productIcons: Record<string, React.ComponentType<any>> = {
  'programa_fabricacion': Calendar,
  'notificaciones': Notification,
  'avisos_mantenimiento': Mantenimiento,
  'mermas': Mermas,
  'mts': MTS,
  'stock_materiales': Stock,
  'venta_exportacion': Export,
};

// Componente para el esqueleto de una tarjeta
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


export default function DataProduct({ products, loading }: DataProductProps) {

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const formatProductName = (text: string): string => {
    const words = text.replace(/_+/g, ' ').split(' ');
    return words
      .map(word =>
        ((word.length === 2 && word !== "de") || word.length === 3)
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ');
  };

  return (
    <div className="w-full text-left p-10">
      <h1 className="text-3xl text-[--color-naranjo] font-bold mb-10">
        {loading ? <Skeleton width={400} /> : "Productos de Datos General"}
      </h1>
      <div className="flex flex-wrap gap-5">
        {loading ? (
          // 1. Si está cargando, muestra 6 esqueletos.
          Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : (
          // 2. Si no está cargando, mapea y muestra los productos existentes.
          // Si 'products' está vacío, este map no producirá ninguna salida.
          products.map((productName) => {
            const IconComponent = productIcons[productName] || Calendar;
            return (
              <a key={productName} href={`/products/${slugify(productName)}`} className="group">
                <div className="bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-40">
                  <div className="flex items-center gap-5 mb-2 h-16">
                    <IconComponent className="w-8 h-8 text-[--color-naranjo]" />
                    <h2 className="text-2xl font-semibold transition-colors group-hover:text-[--color-naranjo]">
                      {formatProductName(productName)}
                    </h2>
                  </div>
                  <p className="text-[--color-gris-oscuro]">
                    {productDescriptions[productName] || 'Descripción no disponible.'}
                  </p>
                </div>
              </a>
            );
          })
          // --- CAMBIO CLAVE ---
          // La tercera parte del operador ternario (el "else") ha sido eliminada.
        )}
      </div>
    </div>
  );
}