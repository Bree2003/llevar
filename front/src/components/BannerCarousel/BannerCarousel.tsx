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
    <div
      className="
        relative
        w-full
        h-[180px]
        sm:h-[220px]
        md:h-[300px]
        lg:h-[400px]
        xl:h-[480px]
        2xl:h-[560px]
        overflow-hidden
        rounded-xl
        sm:rounded-2xl
        lg:rounded-[20px]
        bg-gray-200
      "
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-none relative">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div
        className="
          absolute
          bottom-3
          sm:bottom-4
          md:bottom-5
          lg:bottom-6
          left-1/2
          -translate-x-1/2
          flex
          gap-2
          sm:gap-3
          z-10
        "
      >
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            className={`
              rounded-full
              transition-all
              duration-300
              ${
                current === index
                  ? "w-6 sm:w-8 h-2.5 sm:h-3 bg-[--color-accent]"
                  : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-orange-300"
              }
            `}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
