import { useMemo, useState } from "react";
import UserAdminTable from "components/Tables/UserAdminTable";
import { UserModel } from 'models/Admin/usersModel';
import { DomainModel } from 'models/Global/domainsModel';
import { PermissionModel } from 'models/Admin/permissionsModel';

const UsersAdminSection = ({
  userData,
  domains,
  permissions,
  isBusy,
  isLoading,
  handleUserUpdate,
  handleUserDelete,
}: {
  userData: UserModel[] | undefined;
  domains: DomainModel[] | undefined;
  permissions: PermissionModel[] | undefined;
  isBusy: boolean;
  isLoading: boolean;
  handleUserUpdate: (user: UserModel) => void;
  handleUserDelete: (user: UserModel) => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return userData || [];
    }

    return userData?.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    ) || [];
  }, [userData, search]);

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
          text-left
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
              Usuarios
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Administra los usuarios y sus accesos dentro de la plataforma.
            </p>
          </div>
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
              placeholder="Buscar usuario..."
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
          <UserAdminTable
            userData={filteredUsers}
            domains={domains}
            permissions={permissions}
            isBusy={isBusy}
            isLoading={isLoading}
            handleUserUpdate={handleUserUpdate}
            handleUserDelete={handleUserDelete}
          />
        </div>
      </section>
    </>
  );
};

export default UsersAdminSection;
