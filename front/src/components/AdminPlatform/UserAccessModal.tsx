import { useState } from "react";

import { domainUnits } from "data/domain-units";

export type PlatformRole = "Administrador" | "Editor" | "Visualizador";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  domains: string[];
  active: boolean;
}

interface Props {
  user: PlatformUser;
  onClose: () => void;
  onSave: (user: PlatformUser) => void;
}

const UserAccessModal = ({ user, onClose, onSave }: Props) => {
  const [form, setForm] = useState(user);

  const administrator = form.role === "Administrador";

  const toggleDomain = (id: string) => {
    setForm((previous) => ({
      ...previous,

      domains: previous.domains.includes(id)
        ? previous.domains.filter((domain) => domain !== id)
        : [...previous.domains, id],
    }));
  };

  return (
    <div
      className="
        fixed
        inset-0

        z-[100]

        bg-black/60

        flex
        items-center
        justify-center

        p-4
      "
    >
      <div
        className="
          w-full
          max-w-xl

          max-h-[calc(100dvh-2rem)]

          bg-white

          rounded-xl

          shadow-2xl

          flex
          flex-col

          overflow-hidden
        "
      >
        <div
          className="
            px-5
            py-4

            flex
            items-center
            justify-between

            border-b
            border-[--color-border]
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold

                text-[--color-text-primary]
              "
            >
              {user.id ? "Administrar usuario" : "Agregar usuario"}
            </h2>

            <p
              className="
                mt-1
                text-sm

                text-[--color-text-secondary]
              "
            >
              Define permisos y acceso a dominios.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-9
              h-9

              rounded-lg

              text-xl

              hover:bg-[--color-background]
            "
          >
            ×
          </button>
        </div>

        <div
          className="
            flex-1
            min-h-0

            overflow-y-auto

            p-5

            space-y-5
          "
        >
          <Field label="Nombre">
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className={inputStyle}
            />
          </Field>

          <Field label="Correo electrónico">
            <input
              value={form.email}
              type="email"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className={inputStyle}
            />
          </Field>

          <Field label="Rol">
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value as PlatformRole,
                })
              }
              className={inputStyle}
            >
              <option>Administrador</option>

              <option>Editor</option>

              <option>Visualizador</option>
            </select>
          </Field>

          <div>
            <p
              className="
                text-sm
                font-semibold

                text-[--color-text-primary]
              "
            >
              Acceso a dominios
            </p>

            <p
              className="
                mt-1
                mb-3

                text-xs

                text-[--color-text-muted]
              "
            >
              Selecciona los dominios disponibles para este usuario.
            </p>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-2
              "
            >
              {domainUnits.map((domain) => {
                const selected =
                  administrator || form.domains.includes(domain.id);

                return (
                  <button
                    key={domain.id}
                    type="button"
                    disabled={administrator}
                    onClick={() => toggleDomain(domain.id)}
                    className={`
                        p-3

                        flex
                        items-center
                        gap-3

                        rounded-lg

                        border

                        text-left

                        ${
                          selected
                            ? `
                              border-[--color-accent]
                              bg-[--color-accent-light]
                            `
                            : `
                              border-[--color-border]

                              hover:border-[--color-accent]
                            `
                        }
                      `}
                  >
                    <span
                      className={`
                          w-4
                          h-4

                          rounded

                          border

                          flex
                          items-center
                          justify-center

                          text-[10px]

                          ${
                            selected
                              ? `
                                bg-[--color-accent]
                                border-[--color-accent]

                                text-white
                              `
                              : `
                                border-[--color-border]
                              `
                          }
                        `}
                    >
                      {selected ? "✓" : ""}
                    </span>

                    <span className="text-sm font-medium">{domain.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label
            className="
              p-4

              flex
              items-center
              justify-between

              border
              border-[--color-border]

              rounded-lg
            "
          >
            <div>
              <p className="text-sm font-semibold">Usuario activo</p>

              <p
                className="
                  mt-0.5

                  text-xs

                  text-[--color-text-muted]
                "
              >
                Permite acceder a la plataforma.
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({
                  ...form,
                  active: e.target.checked,
                })
              }
              className="
                w-4
                h-4

                accent-[--color-accent]
              "
            />
          </label>
        </div>

        <div
          className="
            px-5
            py-4

            border-t
            border-[--color-border]

            flex
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              px-4
              py-2.5

              rounded-lg

              border
              border-[--color-border]

              text-sm
              font-semibold
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => onSave(form)}
            className="
              px-4
              py-2.5

              rounded-lg

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold
            "
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label
      className="
        block

        mb-1.5

        text-sm
        font-semibold

        text-[--color-text-primary]
      "
    >
      {label}
    </label>

    {children}
  </div>
);

const inputStyle = `
  w-full

  px-3
  py-2.5

  bg-white

  border
  border-[--color-border]

  rounded-lg

  text-sm

  outline-none

  focus:border-[--color-accent]
`;

export default UserAccessModal;
