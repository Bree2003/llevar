import { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
  UserTokenModel,
  UserTokenToModel,
} from "../models/user-token.model";
import loadUserPermissions from "../services/get-user-permissions";
import {
  setUserTokenLoading,
  setUserToken,
} from "../../../store/actions/userToken";
import Loading from "components/Global/Loading/Loading";
import { useAppSelector } from "../../../store/hooks/redux-hooks";
import { SSO_CREDENTIALS_TEXT } from "constants/constants";

export const UserTokenPermission = ({ children }: { children: ReactElement }) => {
  const { loading } = useAppSelector((state: any) => state.UserPermissions);

  const dispatch: Dispatch<any> = useDispatch();

  const saveUserToken = async (
    userToken: UserTokenModel | undefined
  ) => {
    await dispatch(setUserToken(userToken));
  };

  useEffect(() => {
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    await setUserTokenLoading();
    try {
      const userPermissions = await loadUserPermissions();
      const userTokenPermission: UserTokenModel = await UserTokenToModel(userPermissions);
      await saveUserToken(userTokenPermission);
    } catch (e) {
      await saveUserToken(undefined);
    }
  };

  return !loading ? children : <Loading message={SSO_CREDENTIALS_TEXT} />;
};

export default UserTokenPermission;
