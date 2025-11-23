const CLIENT_ID = process.env.REACT_APP_AZURE_CLIENT_ID;
const API_CLIENT_ID = process.env.REACT_APP_AZURE_API_CLIENT_ID;
const TENANT = process.env.REACT_APP_AZURE_TENANT;
const FRONT_HOST = process.env.REACT_APP_FRONT_HOST;
const SCOPE = process.env.REACT_APP_AZURE_SCOPE;

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT}`,
    redirectUri: FRONT_HOST,
    postLogoutRedirectUri: `${FRONT_HOST}/loggedout`,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateCookie: false,
  },
  system: {
    tokenRenewalOffsetSeconds: 300,
  },
};

export const loginRequest = {
  scopes: [`api://${API_CLIENT_ID}/${SCOPE}`],
  redirectUri: FRONT_HOST,
};
