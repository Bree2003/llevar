import { UserTokenModel } from "../../modules/tokenPermission/models/user-token.model";
import { Dispatch } from "react";
import { UserTokenAction } from "../models/userToken";

export const USER_TOKEN = "USER_TOKEN";
export const USER_TOKEN_LOADING = "USER_TOKEN_LOADING";

export const setUserTokenLoading = () => {
  return async (dispatch: Dispatch<UserTokenAction>) => {
    dispatch({
      type: USER_TOKEN_LOADING,
      payload: undefined,
    });
  };
};

export const setUserToken = (
  userToken: UserTokenModel | undefined
) => {
  return async (dispatch: Dispatch<UserTokenAction>) => {
    dispatch({
      type: USER_TOKEN,
      payload: userToken,
    });
  };
};
