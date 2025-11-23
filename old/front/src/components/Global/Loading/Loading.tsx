import styled from "styled-components";
import { ReactComponent as Logo } from 'components/Global/Icons/logo.svg';
import { SvgIcon } from "@mui/material";
import { SvgIconProps } from "@mui/material/SvgIcon/SvgIcon";

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

const Spinner = styled.div`
  margin: auto;
  border: 5px solid #eaf0f6;
  border-radius: 50%;
  border-top: 5px solid #309F33;
  width: 150px;
  height: 150px;
  background: #FFFFFF;
  animation: spinner 4s linear infinite;

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
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
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.9);
`;

const LogoProperties = {
  padding: 0,
  margin: 0,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontSize: 150,
  color: "#309F33",
};

const LogoIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon viewBox="0 0 74 28" {...props}>
            <Logo />
        </SvgIcon>
    )
}

const Loading = ({
    message,
    backgroundColor,
}: {
    message?: string;
    backgroundColor?: string;
}) => {
    return (
      <MainScreen background={backgroundColor} >
        <Spinner />
        <LogoIcon sx={LogoProperties} />
        <Message>{message}</Message>
      </MainScreen>
    );
  };

export default Loading;
