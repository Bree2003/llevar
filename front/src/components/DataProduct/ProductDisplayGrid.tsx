import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// --- IMPORTS DE ICONOS EXISTENTES ---
import { ReactComponent as Calendar } from "components/Global/Icons/calendar.svg";
import { ReactComponent as Notification } from "components/Global/Icons/notification.svg";
import { ReactComponent as Mantenimiento } from "components/Global/Icons/mantenimiento.svg";
import { ReactComponent as Mermas } from "components/Global/Icons/mermas.svg";
import { ReactComponent as MTS } from "components/Global/Icons/mts.svg";
import { ReactComponent as Stock } from "components/Global/Icons/stock.svg";
import { ReactComponent as Export } from "components/Global/Icons/export.svg";

// --- IMPORTS DE DOCUMENTACIÓN (Ejemplo) ---
// Descomenta y ajusta las rutas cuando tengas los archivos reales
// import DocPrograma from "assets/docs/programa_fabricacion.pdf";
// import DocNotificaciones from "assets/docs/notificaciones_manual.pdf";

// --- ICONO GENÉRICO (SVG INLINE) ---
// Usamos este si no hay icono específico definido
const GenericDatabaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
    />
  </svg>
);

interface Product {
  id: string;
  label: string;
}

interface ProductDisplayGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (productId: string) => void;
  bucketName?: string;
}

// --- CONFIGURACIÓN CENTRALIZADA ---
interface ProductConfig {
  description: string;
  icon: React.ComponentType<any>;
  file?: string; // URL del archivo PDF/Excel
}

const PRODUCT_CONFIG: Record<string, ProductConfig> = {
  programa_de_fabricacion: {
    description: "Plan o cronograma que organiza y controla la fabricación.",
    icon: Calendar,
    file: "DocPrograma",
  },
  notificaciones: {
    description: "Registro semanal que consolida y valida la producción.",
    icon: Notification,
    // file: DocNotificaciones
  },
  avisos_mantenimiento: {
    description: "M4 se refiere a los avisos de mantención correctiva.",
    icon: Mantenimiento,
  },
  mermas: {
    description: "Información que mide las mermas de los insumos secos.",
    icon: Mermas,
  },
  mts: {
    description: "Sistema externo que almacena los tiempos de producción.",
    icon: MTS,
  },
  stock_materiales: {
    description: "Mantiene el stock existente y solicitado.",
    icon: Stock,
  },
  venta_exportacion: {
    description: "Contiene el stock SD y MM.",
    icon: Export,
  },
};

// Configuración por defecto (Fallback)
const DEFAULT_CONFIG: ProductConfig = {
  description: "Descripción no disponible.",
  icon: GenericDatabaseIcon, // <--- Usamos el SVG Inline aquí
  file: undefined,
};

// --- SKELETON ---
const ProductCardSkeleton = () => (
  <div className="bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-48 flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-5 mb-2 h-16">
        <Skeleton circle width={32} height={32} />
        <div className="flex-grow">
          <Skeleton height={28} width={`80%`} />
        </div>
      </div>
      <Skeleton count={2} />
    </div>
    <div className="flex justify-end mt-2">
      <Skeleton width={80} height={20} />
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function ProductDisplayGrid({
  products,
  loading,
  onProductClick,
  bucketName,
}: ProductDisplayGridProps) {
  const formatLabel = (text: string): string => {
    if (!text) return "";
    if (text.length === 3) return text.toUpperCase();

    const cleanText = text.replace(/-/g, " ");
    const connectors = ["de", "del", "el", "la", "los", "las", "en", "y", "o"];

    return cleanText
      .split(" ")
      .map((word, index) => {
        if (index > 0 && connectors.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const handleDownload = (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string
  ) => {
    e.stopPropagation(); // Evita navegar al hacer click en descargar

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full text-left p-10">
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
            // Buscamos la config o usamos la default (GenericIcon)
            const config = PRODUCT_CONFIG[product.id] || DEFAULT_CONFIG;
            const IconComponent = config.icon;

            return (
              <div
                key={product.id}
                onClick={() => onProductClick(product.id)}
                className="group relative bg-[--color-gris-claro] p-5 rounded-xl w-[290px] h-48 cursor-pointer flex flex-col justify-between transition-all hover:shadow-md border border-transparent hover:border-gray-200"
              >
                {/* Contenido Principal */}
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                      {/* Icono */}
                      <IconComponent className="w-6 h-6 text-[--color-naranjo]" />
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 group-hover:text-[--color-naranjo] transition-colors line-clamp-2">
                      {formatLabel(product.label)}
                    </h2>
                  </div>
                  <p className="text-sm text-[--color-gris-oscuro] line-clamp-3">
                    {config.description}
                  </p>
                </div>

                {/* Footer de la tarjeta con Botón de Descarga */}
                <div className="flex justify-end items-center mt-3 pt-3 border-t border-gray-200/50">
                  {config.file ? (
                    <button
                      onClick={(e) =>
                        handleDownload(
                          e,
                          config.file!,
                          `doc_${product.label}.pdf`
                        )
                      }
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[--color-naranjo] transition-colors py-1 px-2 rounded hover:bg-orange-50"
                      title="Descargar documentación técnica"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Documentación</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-300 italic select-none">
                      Sin documentación
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              No se encontraron productos en este bucket.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
