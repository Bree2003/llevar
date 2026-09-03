export type AdminPlatformSection = "users" | "banners" | "faq" | "concepts";

interface AdminPlatformMenuProps {
  activeSection: AdminPlatformSection;

  onChange: (section: AdminPlatformSection) => void;
}

const menuItems: {
  id: AdminPlatformSection;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "users",
    label: "Usuarios y accesos",
    description: "Roles y dominios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },

  {
    id: "banners",
    label: "Noticias",
    description: "Banners de plataforma",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },

  {
    id: "faq",
    label: "Preguntas frecuentes",
    description: "Centro de ayuda",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 115 0c0 2-2.5 2-2.5 4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },

  {
    id: "concepts",
    label: "Diccionario",
    description: "Conceptos de datos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
];

const AdminPlatformMenu = ({
  activeSection,
  onChange,
}: AdminPlatformMenuProps) => {
  return (
    <aside
      className="
        w-full
        lg:w-[260px]

        flex-shrink-0

        bg-white

        border
        border-[--color-border]

        rounded-xl

        overflow-hidden
      "
    >
      <div
        className="
          px-4
          py-3

          border-b
          border-[--color-border]
        "
      >
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-wide

            text-[--color-text-muted]
          "
        >
          Configuración
        </p>
      </div>

      <nav
        className="
          p-2

          flex
          lg:flex-col

          gap-1

          overflow-x-auto
        "
      >
        {menuItems.map((item) => {
          const active = item.id === activeSection;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`
                flex
                items-center
                gap-3

                min-w-max
                lg:min-w-0

                lg:w-full

                px-3
                py-3

                rounded-lg

                text-left

                transition-colors

                ${
                  active
                    ? `
                      bg-[--color-accent-light]
                      text-[--color-accent]
                    `
                    : `
                      text-[--color-text-secondary]

                      hover:bg-[--color-background]
                      hover:text-[--color-accent]
                    `
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>

              <span className="min-w-0">
                <span
                  className="
                    block

                    text-sm
                    font-semibold

                    whitespace-nowrap
                    lg:whitespace-normal
                  "
                >
                  {item.label}
                </span>

                <span
                  className="
                    hidden
                    lg:block

                    mt-0.5

                    text-xs

                    text-[--color-text-muted]
                  "
                >
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminPlatformMenu;
