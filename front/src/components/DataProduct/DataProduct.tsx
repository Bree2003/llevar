import { ReactComponent as Calendar } from "components/Global/Icons/calendar.svg";
import { ReactComponent as Notification } from "components/Global/Icons/notification.svg";
import { ReactComponent as Mantenimiento } from "components/Global/Icons/mantenimiento.svg";
import { ReactComponent as Mermas } from "components/Global/Icons/mermas.svg";
import { ReactComponent as MTS } from "components/Global/Icons/mts.svg";
import { ReactComponent as Stock } from "components/Global/Icons/stock.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- CAMBIO 1: El tipo de dato que esperamos ---
// Ahora 'Product' coincide con la estructura de 'EnvironmentModel' que viene de IngestScreen.
interface Product {
  id: string;
  label: string; 
  // La propiedad 'name' se elimina de la definición, porque no viene en los datos de entrada.
}

interface DataProductProps {
  // Ahora espera un array de objetos con 'id' y 'label'.
  products: Product[];
  loading?: boolean;
  onProductClick: (id: string) => void;
}

// Mapeos (sin cambios)
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

const environmentDescriptions: Record<string, string> = {
  'dominio_de_origen': 'Fuentes transversarles a más de un producto de datos.',
  'dominio_de_negocio': 'Fuentes propias de cada productos de datos.',
};
// Componente Skeleton (sin cambios)
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


export default function DataProduct({ products, loading, onProductClick }: DataProductProps) {
    
    // La función 'formatProductName' ya no es necesaria, la eliminamos para mayor limpieza.

    return (
        <div className="w-full text-left p-10">
            <h1 className="text-3xl text-[--color-naranjo] font-bold mb-10">
                {loading ? <Skeleton width={400} /> : "Principales Dominios"}
            </h1>
            <div className="flex flex-wrap gap-5">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                ) : (
                    products.map((product) => {
                        // --- CAMBIO 2: Generamos la clave 'name' aquí dentro ---
                        // Transformamos el 'label' (ej: "Avisos Mantenimiento")
                        // en la clave que usan los mapeos (ej: "avisos_mantenimiento").
                        const nameKey = product.label.toLowerCase().replace(/\s+/g, '_');
                        console.log("namekey", nameKey)

                        // Buscamos el icono y la descripción usando la clave que acabamos de generar.
                        const IconComponent = productIcons[nameKey] || Calendar;
                        const description = environmentDescriptions[nameKey] || 'Descripción no disponible.';

                        return (
                            <div
                                key={product.id}
                                onClick={() => onProductClick(product.id)}
                                className="group bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-40 cursor-pointer"
                            >
                                <div className="flex items-center gap-5 mb-2 h-16">
                                    <IconComponent className="w-8 h-8 text-[--color-naranjo]" />
                                    <h2 className="text-2xl font-semibold transition-colors group-hover:text-[--color-naranjo]">
                                        {/* Usamos directamente el 'label' que ya viene con el formato correcto */}
                                        {product.label}
                                    </h2>
                                </div>
                                <p className="text-[--color-gris-oscuro]">
                                    {description}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}