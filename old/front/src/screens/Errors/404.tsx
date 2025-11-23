import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { ReactComponent as DeniedIcon } from "components/Global/Icons/denied-icon.svg";
import { CenteredBox, Title, Message, LinkMessage } from "./styles";

export const NotFoundScreen = () => {
  return (
    <Container maxWidth="lg">
      <br />
      <CenteredBox>
        <Title>P&aacute;gina No Encontrada</Title>
        <DeniedIcon />
        <Message>La p&aacute;gina a la que ha ingresado no existe</Message>
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <LinkMessage>Volver al inicio</LinkMessage>
        </Link>
      </CenteredBox>
    </Container>
  );
};

export default NotFoundScreen;
