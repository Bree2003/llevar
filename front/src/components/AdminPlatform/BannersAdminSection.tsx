import { useMemo, useState } from "react";
import BannerModal, { BannerImage } from "./BannerModal";

const INITIAL_BANNERS: BannerImage[] = [
  {
    id: "1",
    name: "Banner principal",
    src: "/images/banner-1.png",
  },
  {
    id: "2",
    name: "Banner secundario",
    src: "/images/banner-2.png",
  },
];

const BannersAdminSection = () => {
  const [banners, setBanners] = useState<BannerImage[]>(INITIAL_BANNERS);

  const [search, setSearch] = useState("");

  const [editingBanner, setEditingBanner] = useState<BannerImage | null>(null);

  const filteredBanners = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return banners;
    }

    return banners.filter((banner) =>
      banner.name.toLowerCase().includes(query),
    );
  }, [banners, search]);

  const handleSave = (savedBanner: BannerImage) => {
    setBanners((previous) => {
      const exists = previous.some((banner) => banner.id === savedBanner.id);

      if (!exists) {
        return [
          ...previous,
          {
            ...savedBanner,
            id: Date.now().toString(),
          },
        ];
      }

      return previous.map((banner) =>
        banner.id === savedBanner.id ? savedBanner : banner,
      );
    });

    setEditingBanner(null);
  };

  return (
    <>
      <section
        className="
          bg-white

          border
          border-[--color-border]

          rounded-xl

          overflow-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            p-5
            md:p-6

            flex
            flex-col

            sm:flex-row
            sm:items-center
            sm:justify-between

            gap-4

            border-b
            border-[--color-border]
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-bold

                text-[--color-text-primary]
              "
            >
              Noticias y banners
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Administra las imágenes destacadas visibles en la plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingBanner({
                id: "",
                name: "",
                src: "",
              })
            }
            className="
              px-4
              py-2.5

              rounded-lg

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold

              hover:opacity-90
            "
          >
            + Subir banner
          </button>
        </div>

        {/* SEARCH */}
        <div
          className="
            p-4
            md:px-6

            bg-[--color-background]

            border-b
            border-[--color-border]
          "
        >
          <div
            className="
              relative

              w-full
              max-w-md
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="
                absolute
                left-3
                top-1/2

                -translate-y-1/2

                w-4
                h-4

                text-[--color-text-muted]
              "
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar banner..."
              className="
                w-full

                pl-10
                pr-4

                py-2.5

                bg-white

                border
                border-[--color-border]

                rounded-lg

                text-sm

                outline-none

                focus:border-[--color-accent]
              "
            />
          </div>
        </div>

        {/* BANNERS */}
        {filteredBanners.length > 0 ? (
          <div
            className="
              p-5
              md:p-6

              grid
              grid-cols-1

              xl:grid-cols-2

              gap-5
            "
          >
            {filteredBanners.map((banner, index) => (
              <article
                key={banner.id}
                className="
                    border
                    border-[--color-border]

                    rounded-xl

                    overflow-hidden

                    bg-white

                    hover:shadow-sm

                    transition-shadow
                  "
              >
                <div
                  className="
                      relative

                      aspect-[16/6]

                      bg-[--color-background]

                      overflow-hidden
                    "
                >
                  <img
                    src={banner.src}
                    alt={banner.name || `Banner ${index + 1}`}
                    className="
                        absolute
                        inset-0

                        w-full
                        h-full

                        object-cover
                      "
                  />
                </div>

                <div
                  className="
                      px-4
                      py-3

                      flex
                      items-center
                      justify-between

                      gap-3
                    "
                >
                  <div className="min-w-0">
                    <p
                      className="
                          text-sm
                          font-semibold

                          text-[--color-text-primary]

                          truncate
                        "
                    >
                      {banner.name || `Banner ${index + 1}`}
                    </p>

                    <p
                      className="
                          mt-0.5

                          text-xs

                          text-[--color-text-muted]
                        "
                    >
                      Posición {index + 1}
                    </p>
                  </div>

                  <div
                    className="
                        flex
                        gap-1

                        flex-shrink-0
                      "
                  >
                    <button
                      type="button"
                      onClick={() => setEditingBanner(banner)}
                      className="
                          px-3
                          py-2

                          rounded-lg

                          text-sm
                          font-semibold

                          text-[--color-accent]

                          hover:bg-[--color-accent-light]
                        "
                    >
                      Reemplazar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setBanners((previous) =>
                          previous.filter((item) => item.id !== banner.id),
                        )
                      }
                      className="
                          px-3
                          py-2

                          rounded-lg

                          text-sm
                          font-semibold

                          text-red-600

                          hover:bg-red-50
                        "
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="
              py-14

              text-center
            "
          >
            <p
              className="
                font-semibold

                text-[--color-text-primary]
              "
            >
              No se encontraron banners
            </p>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Sube una imagen para agregar un nuevo banner.
            </p>
          </div>
        )}
      </section>

      {editingBanner && (
        <BannerModal
          banner={editingBanner}
          onClose={() => setEditingBanner(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default BannersAdminSection;
