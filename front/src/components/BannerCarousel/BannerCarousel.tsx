import { useEffect, useState } from "react";

interface BannerCarouselProps {
    images: string[];
}

const BannerCarousel = ({ images }: BannerCarouselProps) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!images.length) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [images]);

    return (
        <div className="relative w-full h-[400px] overflow-hidden rounded-[20px] bg-gray-200">
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {images.map((image, index) => (
                    // Contenedor individual para cada slide
                    <div key={index} className="w-full h-full flex-none relative">
                        {/* AQUÍ ESTABA EL ERROR: Se renderizaba {image} (texto) */}
                        {/* SOLUCIÓN: Usar la etiqueta img */}
                        <img
                            src={image} // La URL de la imagen
                            alt={`Slide ${index + 1}`} // Texto alternativo accesible
                            className="w-full h-full object-cover" // Ocupa todo el espacio y recorta para ajustar
                            draggable={false} // Previene arrastrar la imagen nativamente
                        />
                    </div>
                ))}
            </div>

            {/* Indicadores */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrent(index)}
                        className={`
              rounded-full
              transition-all
              duration-300
              ${current === index
                                ? "w-8 h-3 bg-[--color-accent]"
                                : "w-3 h-3 bg-orange-300"
                            }
            `}
                        aria-label={`Ir a la diapositiva ${index + 1}`} // Mejora de accesibilidad
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;