import { useMemo, useState } from "react";
import DomainModal from "./DomainModal";
import DomainAdminTable from "components/Tables/DomainAdminTable";
import { DomainModel } from 'models/Admin/domainsModel';

const DomainAdminSection = ({
    domainData,
    isLoading,
    handleDomainCreate,
    handleDomainUpdate,
}: {
    domainData: DomainModel[] | undefined;
    isLoading: boolean | undefined;
    handleDomainCreate: (domain: DomainModel) => void;
    handleDomainUpdate: (domain: DomainModel) => void;
}) => {
  const [search, setSearch] = useState("");

  const [editingDomain, setEditingDomain] = useState<DomainModel | null>(null);

  const filteredDomains = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!domainData) {
      return [];
    }

    if (!query) {
      return domainData || [];
    }

    return domainData.filter(
      (domain) =>
        domain.id.toLowerCase().includes(query) ||
        domain.name.toLowerCase().includes(query) ||
        domain.description.toLowerCase().includes(query),
    );
  }, [domainData, search]);

  const handleSave = (savedDomain: DomainModel) => {
    handleDomainCreate(savedDomain);
    setEditingDomain(null);
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
              Dominios
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Administra los dominios disponibles dentro de la plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingDomain({
                id: "",
                name: "",
                description: "",
                active: true,
                createdAt: "",
                updatedAt: "",
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

              transition-opacity
            "
          >
            + Nuevo dominio
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
              placeholder="Buscar dominio..."
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

        {/* CONTENT */}
        <div
          className="
            divide-y
            divide-[--color-border]
          "
        >
          <DomainAdminTable
            domainData={filteredDomains}
            isLoading={isLoading}
            handleDomainUpdate={handleDomainUpdate}
          />
        </div>
      </section>

      {editingDomain && (
        <DomainModal
          domain={editingDomain}
          onClose={() => setEditingDomain(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default DomainAdminSection;
