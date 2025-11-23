import styled, { keyframes } from "styled-components"; // Importa keyframes explícitamente

interface MainScreenStyle {
    background?: string;
}

const MainScreen = styled.div<MainScreenStyle>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background: ${(props) => (props.background ? props.background : 'rgba(0, 0, 0, 0.7)')};
`;

// Define la animación de giro directamente con keyframes para styled-components
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div`
  margin: auto;
  border: 5px solid #FF5B35; /* Borde base del spinner */
  border-radius: 50%;
  border-top: 5px solid #000000; /* Borde superior giratorio (color oscuro) */
  width: 150px;
  height: 150px;
  position: relative; /* Necesario para posicionar el logo ABSOLUTAMENTE en el centro */
  animation: ${spin} 2s linear infinite; /* Aplica la animación aquí */
`;

const SpinnerLogoContainer = styled.div`
  position: absolute; /* Para centrarlo dentro de SpinnerWrapper */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centrado perfecto */
  width: 140px; /* El contenedor del logo ocupa todo el espacio del spinner wrapper */
  height: 140px;
  border-radius: 50%; /* Asegura que el logo se recorte si es grande */
  overflow: hidden; /* Recorta la imagen si sobresale del círculo */

  // La imagen de fondo va aquí, en el contenedor interno que NO gira
  background-image: url('/images/logo-loading.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;


const Message = styled.div`
  font-family: "Arial";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  position: absolute;
  top: 65%; /* Ajustado un poco más abajo para el mensaje */
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.9);
`;

const Loading = ({
    message,
    backgroundColor,
}: {
    message?: string;
    backgroundColor?: string;
}) => {
    return (
      <MainScreen background={backgroundColor} >
        <div>
          <SpinnerLogoContainer />
        <SpinnerWrapper />
        </div>
        <Message>{message}</Message>
      </MainScreen>
    );
  };

export default Loading;