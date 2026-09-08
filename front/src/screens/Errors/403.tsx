import { useNavigate } from "react-router-dom";

import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";
import StatusScreen from "components/UI/StatusScreen";

const ForbiddenScreen = () => {
  const navigate = useNavigate();

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
        </>
      }
      actionLabel="Cerrar sesión"
      onAction={() => navigate("/logout")}
      icon={<DeniedIcon className="w-8 h-8 md:w-10 md:h-10" />}
    />
  );
};

export default ForbiddenScreen;
