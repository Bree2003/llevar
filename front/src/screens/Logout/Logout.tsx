import StatusScreen from "components/UI/StatusScreen";
import { useNavigate } from "react-router-dom";

const LogoutScreen = () => {
  const navigate = useNavigate();

  const handleOnLogin = () => {
    navigate("/");
  };

  return (
    <StatusScreen
      eyebrow="Sesión finalizada"
      title="¡Hasta pronto!"
      message={
        <>
          Su sesión se ha cerrado correctamente.
          <br />
          Puede volver a iniciar sesión cuando lo necesite.
        </>
      }
      actionLabel="Iniciar sesión"
      onAction={handleOnLogin}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 md:w-10 md:h-10"
        >
          <path
            d="M5 12.5L9.2 16.5L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
    />
  );
};

export default LogoutScreen;
