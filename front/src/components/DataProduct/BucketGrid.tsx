import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Iconos Genéricos ---
const BucketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[--color-naranjo]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
);
// Icono para "Productos"
const ProductIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[--color-naranjo]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);


// --- CAMBIO 1: Hacemos el tipo de 'items' más flexible ---
// El item puede ser un simple string o un objeto con más detalles.
type GridItem = string | {
  name: string;        // Identificador único (siempre requerido)
  label?: string;       // Texto a mostrar (si no está, se genera del 'name')
  description?: string; // Descripción opcional
  icon?: 'product' | 'bucket'; // Tipo de icono opcional
};

interface ProductCardGridProps {
  title: string;
  items: GridItem[];
  loading?: boolean;
  onItemClick: (itemName: string) => void;
}

const ProductCardSkeleton = () => (
    <div className="bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-40">
        <div className="flex items-center gap-5 mb-2 h-16"><Skeleton circle width={32} height={32} /><div className="flex-grow"><Skeleton height={28} width={`80%`} /></div></div>
        <Skeleton count={2} />
    </div>
);


export default function ProductCardGrid({ title, items, loading, onItemClick }: ProductCardGridProps) {

    // const formatItemName = (text: string): string => {
    //     return text.replace(/[_-]+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // };

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

    return (
        <div className="w-full text-left p-10">
            <h1 className="text-3xl text-[--color-naranjo] font-bold mb-10">
                {loading ? <Skeleton width={400} /> : title}
            </h1>
            <div className="flex flex-wrap gap-5">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)
                ) : items.length > 0 ? (
                    items.map((item) => {
                        // --- CAMBIO 2: Normalizamos el 'item' para trabajar siempre con un objeto ---
                        const isString = typeof item === 'string';
                        const name = isString ? item : item.name;
                        // const label = isString ? formatItemName(item) : (item.label || formatItemName(item.name));
                        const label = name;
                        const description = isString ? "Módulo de SAP." : (item.description || "Descripción no disponible.");
                        const iconType = isString ? 'bucket' : (item.icon || 'product');

                        const IconComponent = iconType === 'bucket' ? BucketIcon : ProductIcon;

                        return (
                            <div
                                key={name}
                                onClick={() => onItemClick(name)}
                                className="group bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-40 cursor-pointer"
                            >
                                <div className="flex items-center gap-5 mb-2 h-16">
                                    <IconComponent />
                                    <h2 className="text-2xl font-semibold transition-colors group-hover:text-[--color-naranjo]">
                                        {getSapModuleLabel(label)}
                                    </h2>
                                </div>
                                <p className="text-[--color-gris-oscuro]">{description}</p>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        No se encontraron elementos.
                    </div>
                )}
            </div>
        </div>
    );
}