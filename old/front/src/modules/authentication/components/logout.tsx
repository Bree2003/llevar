import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { deleteFromSessionStorage } from "services/utils";
import Loading from "components/Global/Loading/Loading";
import { SSO_LOGOUT_TEXT } from "constants/constants";

const Logout = () => {
  const { instance } = useMsal();
  useEffect(() => {
    instance.logoutRedirect().then(() => deleteFromSessionStorage('accessToken')).catch((e) => {});
  }, []);

  return <Loading message={SSO_LOGOUT_TEXT} />;
};

export default Logout;
