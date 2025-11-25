import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";
import {
  CenteredBox,
  Row,
  Title,
  Message,
  LinkMessage,
} from "./styles";

export const NotAuthorizedScreen = () => {
  return (
    <Container maxWidth="lg">
      <br />
      <CenteredBox>
        <Title>Acceso Denegado</Title>
        <DeniedIcon />
        <Row>
          <Message>
            Usted no posee permisos para ingresar a esta secci&oacute;n.
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
