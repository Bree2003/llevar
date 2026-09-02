import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "services/sso-authentication";
import Loading from "components/Global/Loading/Loading";
import { SSO_LOGIN_TEXT } from "constants/constants";

const Login = () => {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const signIn = async () => {
    if(!isAuthenticated && inProgress === InteractionStatus.None){
      try{
        await instance.loginRedirect(loginRequest);
      } catch(e) {
        console.error('Login Error: ', e);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    signIn();
  }, [isAuthenticated, inProgress, instance]);

  return <Loading message={SSO_LOGIN_TEXT} />;
};

export default Login;
