import { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { getOnSessionStorage } from "services/utils";
import {
  UserTokenModel,
  UserTokenToModel,
} from "../models/user-token.model";
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
    loadUserPermissions();
  }, []);

  const loadUserPermissions = async () => {
    await setUserTokenLoading();
    try {
      const token = await getOnSessionStorage('accessToken');
      const userTokenPermission: UserTokenModel = await UserTokenToModel(
        token
      );
      await saveUserToken(userTokenPermission);
    } catch (e) {
      await saveUserToken(undefined);
    }
  };

  return !loading ? children : <Loading message={SSO_CREDENTIALS_TEXT} />;
};

export default UserTokenPermission;
