import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";
import { CenteredBox, Row, Title, Message, LinkMessage } from "./styles";

export const ForbiddenScreen = () => {
  return (
    <Container maxWidth="lg">
      <CenteredBox>
        <div style={{ transform: "scale(1.2)", marginBottom: "10px" }}>
          <DeniedIcon />
        </div>

        <Title>Acceso Denegado</Title>

        <Row>
          <Message>
            Su cuenta se encuentra desactivada.
            <br />
            Contacte al administrador si cree que es un error.
          </Message>
        </Row>

        <Link to={"/logout"} style={{ textDecoration: "none" }}>
          <LinkMessage>Cerrar Sesi&oacute;n</LinkMessage>
        </Link>
      </CenteredBox>
    </Container>
  );
};

export default ForbiddenScreen;
