import { useState } from "react";
import { PermissionModel } from "models/Admin/permissionsModel";
import { UserModel } from "models/Admin/usersModel";

interface Props {
  user: UserModel;
  permissions: PermissionModel[] | undefined;
  onClose: () => void;
  onSave: (user: UserModel) => void;
}

const PermissionConfigModal = ({ user, permissions, onClose, onSave }: Props) => {
  const [form, setForm] = useState<UserModel>(user);

  const togglePermission = (permission: PermissionModel) => {
    setForm((prev: UserModel) => ({
      ...prev,
      permissions: prev.permissions.some(x => x.id === permission.id)
        ? prev.permissions.filter(x => x.id !== permission.id)
        : [...prev.permissions, permission]
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
              Configuraci&oacute;n de Permisos
            </h2>

            <p
              className="
                mt-1
                text-sm

                text-[--color-text-secondary]
              "
            >
              Usuario: <b>{`${user.name} ${user.surname}`}</b>
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
          <div>
            <p
              className="
                text-sm
                font-semibold

                text-[--color-text-primary]
              "
            >
              Acceso a funcionalidades
            </p>

            <p
              className="
                mt-1
                mb-3

                text-xs

                text-[--color-text-muted]
              "
            >
              Selecciona los permisos disponibles para este usuario.
            </p>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-2
              "
            >
              {permissions !== undefined && permissions.length > 0 ? (permissions.map((permission) => {
                const selected = form.permissions.findIndex((x) => x.id === permission.id) >= 0;

                return (
                  <button
                    key={permission.id}
                    type="button"
                    onClick={() => togglePermission(permission)}
                    className={`
                        p-3

                        flex
                        items-center
                        gap-3

                        rounded-lg

                        border

                        text-left

                        ${selected
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

                          ${selected
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

                    <span className="text-sm font-medium">{permission.name}</span>
                  </button>
                );
              })) : null}
            </div>
          </div>
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

export default PermissionConfigModal;
