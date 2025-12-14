import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";
import { CenteredBox, Row, Title, Message, LinkMessage } from "./styles";

export const NotAuthorizedScreen = () => {
  return (
    <Container maxWidth="lg">
      <CenteredBox>
        <div style={{ transform: "scale(1.2)", marginBottom: "10px" }}>
          <DeniedIcon />
        </div>

        <Title>Acceso Denegado</Title>

        <Row>
          <Message>
            Usted no posee los permisos necesarios para ingresar a esta
            secci&oacute;n.
            <br />
            Contacte al administrador si cree que es un error.
          </Message>
        </Row>

        <Link to={"/"} style={{ textDecoration: "none" }}>
          <LinkMessage>Volver al inicio</LinkMessage>
        </Link>
      </CenteredBox>
    </Container>
  );
};

export default NotAuthorizedScreen;
