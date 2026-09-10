import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";

import StatusScreen from "components/UI/StatusScreen";

import { LinksModel, LinksDataToModel } from "models/Global/linksModel";

import loadLinksData from "services/Global/get-links-data";

const ForbiddenScreen = () => {
  const navigate = useNavigate();

  const [links, setLinks] = useState<LinksModel | undefined>();

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const response = await loadLinksData();

      const linksData = LinksDataToModel(response);

      setLinks(linksData ?? undefined);
    } catch (error) {
      console.error("Error al cargar enlaces:", error);

      setLinks(undefined);
    }
  };

  const platformAccessUrl = links?.enlaceAccesoPlataforma?.trim();

  return (
    <StatusScreen
      eyebrow="Cuenta sin acceso"
      title="Acceso denegado"
      message={
        <>
          Su cuenta se encuentra desactivada o no cuenta con los permisos
          necesarios para acceder a esta aplicación.
          <br />
          Contacte al administrador si cree que se trata de un error.
          {platformAccessUrl && (
            <span className="flex justify-center mt-5">
              <a
                href={platformAccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center

                  px-5
                  py-2.5

                  rounded-[10px]

                  border
                  border-[--color-accent]

                  bg-white

                  text-sm
                  font-semibold
                  text-[--color-accent]

                  hover:bg-[--color-accent-light]

                  transition-colors
                "
              >
                Solicitar acceso a la plataforma
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 ml-2"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </a>
            </span>
          )}
        </>
      }
      actionLabel="Cerrar sesión"
      onAction={() => navigate("/logout")}
      icon={<DeniedIcon className="w-8 h-8 md:w-10 md:h-10" />}
    />
  );
};

export default ForbiddenScreen;
