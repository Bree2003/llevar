import { useEffect, useMemo, useState } from "react";

import { LinksModel } from "models/Global/linksModel";

interface LinksAdminSectionProps {
  linksData: LinksModel | undefined;
  isBusy: boolean;
  isLoading: boolean;
  handleLinksUpdate: (links: LinksModel) => void;
}

const EMPTY_LINKS: LinksModel = {
  enlaceAccesoReporte: "",
  enlaceSoporte: "",
  enlaceAccesoPlataforma: "",
};

const LinksAdminSection = ({
  linksData,
  isBusy,
  isLoading,
  handleLinksUpdate,
}: LinksAdminSectionProps) => {
  const [form, setForm] = useState<LinksModel>(EMPTY_LINKS);

  useEffect(() => {
    if (linksData) {
      setForm({
        enlaceAccesoReporte: linksData.enlaceAccesoReporte ?? "",
        enlaceSoporte: linksData.enlaceSoporte ?? "",
        enlaceAccesoPlataforma: linksData.enlaceAccesoPlataforma ?? "",
      });
    } else {
      setForm(EMPTY_LINKS);
    }
  }, [linksData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges = useMemo(() => {
    if (!linksData) {
      return (
        form.enlaceAccesoReporte !== "" ||
        form.enlaceSoporte !== "" ||
        form.enlaceAccesoPlataforma !== ""
      );
    }

    return (
      form.enlaceAccesoReporte !== linksData.enlaceAccesoReporte ||
      form.enlaceSoporte !== linksData.enlaceSoporte ||
      form.enlaceAccesoPlataforma !== linksData.enlaceAccesoPlataforma
    );
  }, [form, linksData]);

  const canSave =
    form.enlaceAccesoReporte.trim() !== "" &&
    form.enlaceSoporte.trim() !== "" &&
    form.enlaceAccesoPlataforma.trim() !== "" &&
    hasChanges &&
    !isBusy;

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    handleLinksUpdate({
      enlaceAccesoReporte: form.enlaceAccesoReporte.trim(),
      enlaceSoporte: form.enlaceSoporte.trim(),
      enlaceAccesoPlataforma: form.enlaceAccesoPlataforma.trim(),
    });
  };

  const handleReset = () => {
    setForm(
      linksData
        ? {
            enlaceAccesoReporte: linksData.enlaceAccesoReporte ?? "",
            enlaceSoporte: linksData.enlaceSoporte ?? "",
            enlaceAccesoPlataforma: linksData.enlaceAccesoPlataforma ?? "",
          }
        : EMPTY_LINKS,
    );
  };

  const linkFields = [
    {
      id: "enlaceAccesoReporte",
      name: "enlaceAccesoReporte",
      label: "Acceso a reportes",
      description:
        "Enlace utilizado para solicitar o gestionar el acceso a un reporte.",
      placeholder: "https://...",
      value: form.enlaceAccesoReporte,
    },
    {
      id: "enlaceSoporte",
      name: "enlaceSoporte",
      label: "Soporte",
      description:
        "Canal al que serán dirigidos los usuarios cuando necesiten ayuda o soporte.",
      placeholder: "https://...",
      value: form.enlaceSoporte,
    },
    {
      id: "enlaceAccesoPlataforma",
      name: "enlaceAccesoPlataforma",
      label: "Acceso a la plataforma",
      description:
        "Enlace utilizado para gestionar o solicitar acceso a la Plataforma Inteligente de Datos.",
      placeholder: "https://...",
      value: form.enlaceAccesoPlataforma,
    },
  ];

  if (isLoading) {
    return (
      <section
        className="
          w-full
          bg-white
          border
          border-[--color-border]
          rounded-xl
          overflow-hidden
        "
      >
        <div className="p-8 text-center text-sm text-[--color-text-secondary]">
          Cargando enlaces...
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        w-full
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
          sm:items-start
          sm:justify-between

          gap-4

          border-b
          border-[--color-border]
        "
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11

                rounded-[10px]

                bg-[--color-accent-light]
                text-[--color-accent]

                flex
                items-center
                justify-center

                flex-shrink-0
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
                <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15" />
              </svg>
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-bold
                  text-[--color-text-primary]
                "
              >
                Enlaces de plataforma
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  leading-relaxed
                  text-[--color-text-secondary]
                "
              >
                Centraliza los enlaces que utiliza la plataforma para dirigir a
                los usuarios a solicitudes de acceso y canales de soporte.
              </p>
            </div>
          </div>
        </div>

        <span
          className="
            w-fit

            px-3
            py-1.5

            rounded-md

            bg-[--color-accent-light]

            text-xs
            font-semibold

            text-[--color-accent]

            whitespace-nowrap
          "
        >
          Configuración global
        </span>
      </div>

      {/* INFO */}
      <div
        className="
          px-5
          py-4
          md:px-6

          bg-[--color-background]

          border-b
          border-[--color-border]
        "
      >
        <div
          className="
            flex
            items-start
            gap-3

            text-sm
            text-[--color-text-secondary]
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="
              mt-0.5
              flex-shrink-0
              text-[--color-accent]
            "
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
          </svg>

          <p>
            Estos enlaces son compartidos por toda la plataforma. Los cambios
            que realices aquí afectarán los accesos disponibles para los
            usuarios.
          </p>
        </div>
      </div>

      {/* CAMPOS */}
      <div
        className="
          p-5
          md:p-6

          space-y-6
        "
      >
        {linkFields.map((field) => (
          <div
            key={field.id}
            className="
              pb-6

              border-b
              border-[--color-border]

              last:border-b-0
              last:pb-0
            "
          >
            <div
              className="
                flex
                flex-col

                lg:flex-row
                lg:items-start
                lg:justify-between

                gap-4
                lg:gap-8
              "
            >
              <div
                className="
                  w-full
                  lg:max-w-[300px]
                  lg:flex-shrink-0
                "
              >
                <label
                  htmlFor={field.id}
                  className="
                    text-sm
                    font-semibold
                    text-[--color-text-primary]
                  "
                >
                  {field.label}
                </label>

                <p
                  className="
                    mt-1

                    text-xs
                    leading-relaxed

                    text-[--color-text-secondary]
                  "
                >
                  {field.description}
                </p>
              </div>

              <div className="w-full flex-1 min-w-0">
                <div className="flex gap-2">
                  <input
                    id={field.id}
                    name={field.name}
                    type="url"
                    value={field.value}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    disabled={isBusy}
                    className="
                      w-full
                      min-w-0

                      px-3
                      py-2.5

                      bg-white

                      border
                      border-[--color-border]

                      rounded-lg

                      text-sm
                      text-[--color-text-primary]

                      outline-none

                      focus:border-[--color-accent]

                      disabled:bg-[--color-background]
                      disabled:cursor-not-allowed
                    "
                  />

                  {field.value.trim() !== "" && (
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir enlace"
                      aria-label={`Abrir ${field.label}`}
                      className="
                        w-11
                        h-11

                        flex
                        items-center
                        justify-center

                        flex-shrink-0

                        rounded-lg

                        border
                        border-[--color-border]

                        text-[--color-text-secondary]

                        hover:border-[--color-accent]
                        hover:text-[--color-accent]
                        hover:bg-[--color-accent-light]

                        transition-colors
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div
        className="
          px-5
          py-4
          md:px-6

          border-t
          border-[--color-border]

          bg-[--color-background]

          flex
          flex-col-reverse
          sm:flex-row
          sm:items-center
          sm:justify-end

          gap-3
        "
      >
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || isBusy}
          className="
            px-4
            py-2.5

            rounded-lg

            border
            border-[--color-border]

            bg-white

            text-sm
            font-semibold

            text-[--color-text-secondary]

            hover:bg-[--color-background]

            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Descartar cambios
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="
            px-4
            py-2.5

            rounded-lg

            bg-[--color-accent]

            text-sm
            font-semibold
            text-white

            hover:opacity-90

            disabled:opacity-50
            disabled:cursor-not-allowed

            transition-opacity
          "
        >
          {isBusy ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </section>
  );
};

export default LinksAdminSection;
