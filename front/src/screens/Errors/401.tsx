import { useNavigate } from "react-router-dom";

import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";
import StatusScreen from "components/UI/StatusScreen";

const NotAuthorizedScreen = () => {
  const navigate = useNavigate();

  return (
    <StatusScreen
      eyebrow="Acceso restringido"
      title="No tienes acceso a esta sección"
      message={
        <>
          Tu usuario no posee los permisos necesarios para ingresar a esta
          sección.
          <br />
          Si crees que se trata de un error, contacta al administrador.
        </>
      }
      actionLabel="Volver al inicio"
      onAction={() => navigate("/")}
      secondaryActionLabel="Volver atrás"
      onSecondaryAction={() => navigate(-1)}
      icon={<DeniedIcon className="w-8 h-8 md:w-10 md:h-10" />}
    />
  );
};

export default NotAuthorizedScreen;
