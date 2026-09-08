import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import commonTheme from "themes/common-theme";
import { Provider } from "react-redux";
import store from "../store/store";
import UserTokenPermission from "modules/tokenPermission/components/userTokenPermission";
import { checkPermission, PermissionList } from "modules/tokenPermission/utils/user-token.util";
import { useAppSelector } from "store/hooks/redux-hooks";

import NotAuthorizedScreen from "screens/Errors/401";
import ForbiddenScreen from "screens/Errors/403";
import NotFoundScreen from "screens/Errors/404";

import AcquireToken from "../modules/authentication/components/acquireToken";
import Login from "modules/authentication/components/login";
import Logout from "modules/authentication/components/logout";
import LogoutScreen from "screens/Logout/Logout";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../services/sso-authentication";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import AppLayout from "AppLayout";
import MainController from "controllers/Main/controller";
import IngestController from "controllers/Ingest/controller";
import BucketListController from "controllers/Ingest/BucketListController";
import ProductListController from "controllers/Ingest/ProductListController";
import FolderListController from "controllers/Ingest/FolderListController";
import PreviewController from "controllers/Ingest/PreviewController";
import LoginController from "controllers/Login/LoginController";
import MarketplaceController from "controllers/Marketplace/controller";
import DomainController from "controllers/Marketplace/DomainController";
import AdminController from "controllers/Admin/AdminController";
import ReportController from "controllers/Marketplace/ReportController";
import OnboardingController from "controllers/Onboarding/controller";
import FaqController from "controllers/Faq/controller";
import ConceptosController from "controllers/Conceptos/controller";
import AdminMarketplaceController from "controllers/Admin/AdminMarketplaceController";
import AdminPlatformController from "controllers/Admin/AdminPlatformController";

const msalInstance = new PublicClientApplication(msalConfig as Configuration);

const NotFoundRedirectRoute = () => {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("404");
  }, []);
  return <></>;
};

const ProtectedRoute = ({
  permission
}: {
  permission?: PermissionList;
}) => {
  const { user } = useAppSelector((state) => state.UserPermissions);
  const permissions = user.permissions;
  const isUserActive = user.active;

  // if (!isUserActive) {
  //   return <Navigate to="/403" />;
  // }

  // if (!checkPermission(permissions, "reader")) {
  //   return <Navigate to="/403" />;
  // }

  // if (permission && !checkPermission(permissions, permission)) {
  //   return <Navigate to="/401" />;
  // }

  return <Outlet />;
};

const Router = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={commonTheme}>
        <AuthenticatedTemplate>
          <AcquireToken>
            <Provider store={store}>
              <UserTokenPermission>
                <BrowserRouter>
                  <SnackbarProvider
                    maxSnack={5}
                    dense
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <div className="App App-background">
                      <Routes>
                        <Route path="401" element={<NotAuthorizedScreen />} />
                        <Route path="403" element={<ForbiddenScreen />} />
                        <Route path="404" element={<NotFoundScreen />} />
                        <Route element={<ProtectedRoute />}>
                          <Route element={<AppLayout />}>
                            <Route path="/" element={<MainController />} />
                            <Route
                              path="/onboarding"
                              element={<OnboardingController />}
                            />
                            <Route path="/faq" element={<FaqController />} />
                            <Route
                              path="/conceptos"
                              element={<ConceptosController />}
                            />
                            <Route element={<ProtectedRoute permission="marketplace-reader" />}>
                              <Route
                                path="/marketplace"
                                element={<MarketplaceController />}
                              />
                              <Route
                                path="/marketplace/:domainId"
                                element={<DomainController />}
                              />
                              <Route
                                path="/marketplace/:domainId/:reportId"
                                element={<ReportController />}
                              />
                            </Route>
                            <Route element={<ProtectedRoute permission="admin" />}>
                              <Route
                                path="/admin"
                                element={<AdminController />}
                              />
                            </Route>
                            <Route element={<ProtectedRoute permission="marketplace-admin" />}>
                              <Route
                                path="/admin/marketplace"
                                element={<AdminMarketplaceController />}
                              />
                            </Route>
                            <Route element={<ProtectedRoute permission="platform-admin" />}>
                              <Route
                                path="/admin/platform"
                                element={<AdminPlatformController />}
                              />
                            </Route>
                            <Route element={<ProtectedRoute permission="ingestion-reader" />}>
                              <Route
                                path="/dashboard"
                                element={<IngestController />}
                              />
                              <Route
                                path="/dashboard/:envId"
                                element={<BucketListController />}
                              />
                              <Route
                                path="/dashboard/:envId/:bucketName/products"
                                element={<ProductListController />}
                              />
                              <Route
                                path="/dashboard/:envId/:bucketName/:productName/folders"
                                element={<FolderListController />}
                              />
                              <Route
                                path="/dashboard/:envId/:bucketName/:productName/:tableName/table"
                                element={<PreviewController />}
                              />
                            </Route>
                          </Route>
                        </Route>
                        <Route path="/logout" element={<Logout />} />
                        <Route path="*" element={<NotFoundRedirectRoute />} />
                      </Routes>
                    </div>
                  </SnackbarProvider>
                </BrowserRouter>
              </UserTokenPermission>
            </Provider>
          </AcquireToken>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/loggedout" element={<LogoutScreen />} />
              <Route path="*" element={<LoginController />} />
            </Routes>
          </BrowserRouter>
        </UnauthenticatedTemplate>
      </ThemeProvider>
    </MsalProvider>
  );
};

export default Router;
