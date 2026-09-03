import { useMemo, useState } from "react";

import { domainUnits } from "data/domain-units";
import UserAccessModal, { PlatformUser } from "./UserAccessModal";

const INITIAL_USERS: PlatformUser[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@cyt.cl",
    role: "Administrador",
    domains: [],
    active: true,
  },

  {
    id: "2",
    name: "Juan Pérez",
    email: "juan.perez@cyt.cl",
    role: "Editor",
    domains: [domainUnits[0]?.id, domainUnits[1]?.id].filter(
      Boolean,
    ) as string[],
    active: true,
  },

  {
    id: "3",
    name: "Camila Soto",
    email: "camila.soto@cyt.cl",
    role: "Visualizador",
    domains: [domainUnits[0]?.id].filter(Boolean) as string[],
    active: false,
  },
];

const UsersAdminSection = () => {
  const [users, setUsers] = useState(INITIAL_USERS);

  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [search, users]);

  const getDomainLabel = (id: string) =>
    domainUnits.find((domain) => domain.id === id)?.name || id;

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
              Usuarios y accesos
            </h2>

            <p
              className="
                mt-1
                text-sm

                text-[--color-text-secondary]
              "
            >
              Administra roles y acceso a dominios específicos.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingUser({
                id: "",
                name: "",
                email: "",
                role: "Visualizador",
                domains: [],
                active: true,
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
            + Agregar usuario
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

        {/* USERS */}
        <div className="overflow-x-auto">
          <table
            className="
              w-full

              min-w-[850px]

              text-sm
            "
          >
            <thead
              className="
                bg-[--color-background]

                text-[--color-text-muted]
              "
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Usuario
                </th>

                <th className="px-6 py-3 text-left text-xs uppercase">Rol</th>

                <th className="px-6 py-3 text-left text-xs uppercase">
                  Dominios
                </th>

                <th className="px-6 py-3 text-left text-xs uppercase">
                  Estado
                </th>

                <th className="px-6 py-3 text-right text-xs uppercase">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody
              className="
                divide-y
                divide-[--color-border]
              "
            >
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="
                      hover:bg-[--color-background]

                      transition-colors
                    "
                >
                  <td className="px-6 py-4">
                    <p
                      className="
                          font-semibold

                          text-[--color-text-primary]
                        "
                    >
                      {user.name}
                    </p>

                    <p
                      className="
                          mt-0.5
                          text-xs

                          text-[--color-text-muted]
                        "
                    >
                      {user.email}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className="
                          px-2.5
                          py-1

                          rounded-full

                          bg-[--color-accent-light]

                          text-xs
                          font-semibold

                          text-[--color-accent]
                        "
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {user.role === "Administrador" ? (
                      <span
                        className="
                            text-[--color-text-secondary]
                          "
                      >
                        Todos los dominios
                      </span>
                    ) : (
                      <div
                        className="
                            flex
                            flex-wrap
                            gap-1
                          "
                      >
                        {user.domains.map((domain) => (
                          <span
                            key={domain}
                            className="
                                  px-2
                                  py-1

                                  rounded-md

                                  bg-[--color-background]

                                  text-xs
                                "
                          >
                            {getDomainLabel(domain)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div
                      className="
                          flex
                          items-center
                          gap-2
                        "
                    >
                      <span
                        className={`
                            w-2
                            h-2

                            rounded-full

                            ${user.active ? "bg-green-500" : "bg-gray-300"}
                          `}
                      />

                      <span
                        className="
                            text-[--color-text-secondary]
                          "
                      >
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
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
                      Administrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editingUser && (
        <UserAccessModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(savedUser) => {
            setUsers((previous) => {
              const exists = previous.some((user) => user.id === savedUser.id);

              if (!exists) {
                return [
                  ...previous,
                  {
                    ...savedUser,
                    id: Date.now().toString(),
                  },
                ];
              }

              return previous.map((user) =>
                user.id === savedUser.id ? savedUser : user,
              );
            });

            setEditingUser(null);
          }}
        />
      )}
    </>
  );
};

export default UsersAdminSection;
