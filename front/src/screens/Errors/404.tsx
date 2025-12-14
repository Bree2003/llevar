import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg"; // Asegúrate que este icono exista
import { CenteredBox, Title, Message, LinkMessage } from "./styles";

export const NotFoundScreen = () => {
  return (
    <Container maxWidth="lg">
      <CenteredBox>
        <div style={{ transform: "scale(1.2)", marginBottom: "10px" }}>
          {/* Si no tienes el icono, puedes usar un emoji temporal o un SVG inline */}
          <DeniedIcon />
        </div>

        <Title>P&aacute;gina No Encontrada</Title>

        <Message>
          Lo sentimos, la p&aacute;gina a la que intenta acceder no existe o ha
          sido movida.
        </Message>

        <Link to={"/"} style={{ textDecoration: "none" }}>
          <LinkMessage>Volver al inicio</LinkMessage>
        </Link>
      </CenteredBox>
    </Container>
  );
};

export default NotFoundScreen;
