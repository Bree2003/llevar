import { useNavigate } from "react-router-dom";

import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";
import StatusScreen from "components/UI/StatusScreen";

const NotFoundScreen = () => {
  const navigate = useNavigate();

  return (
    <StatusScreen
      eyebrow="Error 404"
      title="Página no encontrada"
      message={
        <>
          La página que intenta visitar no existe, fue movida o la dirección
          ingresada no es correcta.
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

export default NotFoundScreen;
