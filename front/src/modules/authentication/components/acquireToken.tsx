import { ReactElement, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { getOnSessionStorage, saveOnSessionStorage } from "services/utils";
import { loginRequest } from "services/sso-authentication";

export const AcquireToken = ({ children }: { children: ReactElement }) => {
  const ONE_SECOND = 1000;
  const ONE_MINUTE = 60000;
  const { instance, accounts } = useMsal();
  const [loaded, setLoaded] = useState(false);
  const [expired, setExpired] = useState<Date | undefined>(undefined);

  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(updateToken, 10 * ONE_SECOND);
    return () => clearInterval(intervalId);
  }, [expired]);

  const updateToken = () => {
    if (expired) {
      let calculatedTime = expired.getTime() - new Date().getTime();
      if (calculatedTime <= 3 * ONE_MINUTE) {
        refreshAllData();
      }
    }
  };

  const refreshAllData = () => {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    instance
      .acquireTokenSilent(request)
      .then((response) => {
        saveOnSessionStorage("accessToken", response.accessToken);
        setLoaded(true);
        setExpired(response.expiresOn ? response.expiresOn : undefined);
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          saveOnSessionStorage("accessToken", response.accessToken);
          setLoaded(true);
          setExpired(response.expiresOn ? response.expiresOn : undefined);
        });
      });
  };

  return loaded ? children : <></>;
};

export default AcquireToken;
