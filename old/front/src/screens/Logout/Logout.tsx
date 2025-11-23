import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as Logo } from 'components/Global/Icons/logo.svg';
import { SvgIcon } from "@mui/material";
import { SvgIconProps } from "@mui/material/SvgIcon/SvgIcon";

const MainScreen = styled.div`
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
  gap: 16px;
  background: #FFFFFF;
`;

const Message = styled.div`
  font-family: "Arial";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000000;
`;

const ButtonLayer = styled.div`
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  & button {
    background: rgba(48, 159, 51, 0.8) !important;
    border: 1px solid rgba(48, 159, 51, 0.12);
  }
  & button:disabled {
    background: rgba(48, 159, 51, 0.3) !important;
    border: 1px solid rgba(48, 159, 51, 0.12);
  }
`;

const LogoProperties = {
    padding: 0,
    margin: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 300,
    color: "#309F33",
};

const LogoIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon viewBox="0 0 74 28" {...props}>
            <Logo />
        </SvgIcon>
    )
}

const LogoutScreen = () => {
    const navigate = useNavigate();

    const handleOnLogin = () => {
        navigate('/');
    };

    return (
        <MainScreen>
            <LogoIcon sx={LogoProperties} />
            <Message>Su sesión se ha cerrado correctamente</Message>
            <ButtonLayer>
                <button
                    className="flex overflow-hidden flex-col justify-center items-center self-stretch px-6 py-2 my-auto text-base font-medium tracking-wide leading-7 uppercase whitespace-nowrap rounded text-white"
                    onClick={handleOnLogin}
                >
                    Iniciar Sesi&oacute;n
                </button>
            </ButtonLayer>
        </MainScreen>
    );
};

export default LogoutScreen;