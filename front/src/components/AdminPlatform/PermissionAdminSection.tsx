import { useMemo, useState } from "react";
import PermissionModal from "./PermissionModal";
import PermissionAdminTable from "components/Tables/PermissionAdminTable";
import { PermissionModel } from 'models/Admin/permissionsModel';

const PermissionAdminSection = ({
    permissionData,
    isLoading,
    handlePermissionCreate,
    handlePermissionUpdate,
}: {
    permissionData: PermissionModel[] | undefined;
    isLoading: boolean | undefined;
    handlePermissionCreate: (permission: PermissionModel) => void;
    handlePermissionUpdate: (permission: PermissionModel) => void;
}) => {
  const [search, setSearch] = useState("");

  const [editingPermission, setEditingPermission] = useState<PermissionModel | null>(null);

  const filteredPermissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!permissionData) {
      return [];
    }

    if (!query) {
      return permissionData || [];
    }

    return permissionData.filter(
      (permission) =>
        permission.id.toLowerCase().includes(query) ||
        permission.name.toLowerCase().includes(query) ||
        permission.description.toLowerCase().includes(query),
    );
  }, [permissionData, search]);

  const handleSave = (savedPermission: PermissionModel) => {
    handlePermissionCreate(savedPermission);
    setEditingPermission(null);
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
              Permisos
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Administra los permisos disponibles para los usuarios de la plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingPermission({
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
            + Nuevo permiso
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
              placeholder="Buscar permiso..."
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
          <PermissionAdminTable
            permissionData={filteredPermissions}
            isLoading={isLoading}
            handlePermissionUpdate={handlePermissionUpdate}
          />
        </div>
      </section>

      {editingPermission && (
        <PermissionModal
          permission={editingPermission}
          onClose={() => setEditingPermission(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default PermissionAdminSection;
