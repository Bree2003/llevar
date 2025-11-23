import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
  useNavigate
} from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import commonTheme from 'themes/common-theme';
import { Provider } from "react-redux";
import store from "../store/store";
import UserTokenPermission from 'modules/tokenPermission/components/userTokenPermission';
import { useTypedSelector } from "store/hooks/useTypeSelector";

import MainController from 'controllers/Main/controller';

import NotAuthorizedScreen from "screens/Errors/401";
import NotFoundScreen from "screens/Errors/404";

import AcquireToken from "../modules/authentication/components/acquireToken";
import Login from "modules/authentication/components/login";
import Logout from 'modules/authentication/components/logout';
import LogoutScreen from 'screens/Logout/Logout';
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../services/sso-authentication";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import FabricacionController from "controllers/Productodato/fabricacion";
import AppLayout from "AppLayout";

const msalInstance = new PublicClientApplication(msalConfig as Configuration);

const NotFoundRedirectRoute = () => {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("404");
  }, []);
  return <></>;
};

const ProtectedRoute = ({ perm }: { perm?: string }) => {
  const { user } = useTypedSelector((state) => state.UserPermissions);
  const roles = user.roles;
  if (user !== undefined && roles.length > 0) {
    const isAppUser = roles.includes('user');
    if (perm !== undefined) {
      const isPerm = roles.includes(perm);
      if (isAppUser === true && isPerm === true) {
        return <Outlet />;
      }
      else {
        return <Navigate to="/401" />;
      }
    }
    if (isAppUser === true) {
      return <Outlet />;
    }
  }
  return <Navigate to="/401" />;
};

const Router = () => {
  return (
    // <MsalProvider instance={msalInstance}>
    <ThemeProvider theme={commonTheme}>
      {/* <AuthenticatedTemplate> */}
      {/* <AcquireToken> */}
      <Provider store={store}>
        {/* <UserTokenPermission> */}
        <BrowserRouter>
          <SnackbarProvider
            maxSnack={5}
            dense
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <div className="App App-background">
              <Routes>
                <Route path="401" element={<NotAuthorizedScreen />} />
                <Route path="404" element={<NotFoundScreen />} />
                {/* <Route
                          path="/"
                          element={<ProtectedRoute />}
                        > */}
                <Route element={<AppLayout />}>
                  <Route
                    path="/"
                    element={<MainController />}
                  />
                  <Route
                    path="/programa-fabricacion"
                    element={<FabricacionController />}
                  />
                </Route>
                {/* </Route> */}
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<NotFoundRedirectRoute />} />
              </Routes>
            </div>
          </SnackbarProvider>
        </BrowserRouter>
        {/* </UserTokenPermission> */}
      </Provider>
      {/* </AcquireToken> */}
      {/* </AuthenticatedTemplate> */}
      {/* <UnauthenticatedTemplate>
          <BrowserRouter>
            <Routes>
              <Route path="/loggedout" element={<LogoutScreen />} /> */}
      {/* <Route path="*" element={<Login />} /> */}
      {/* </Routes>
          </BrowserRouter>
        </UnauthenticatedTemplate> */}
    </ThemeProvider>
    // </MsalProvider>
  );
}

export default Router;
