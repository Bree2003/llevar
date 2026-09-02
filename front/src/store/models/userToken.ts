export interface UserTokenDataModel {
  name: string;
  active: boolean;
}

export interface UserTokenModel {
  username: string;
  name: string;
  surname: string;
  email: string;
  domains: UserTokenDataModel[];
  permissions: UserTokenDataModel[];
  active: boolean;
}

export type UserTokenState = {
  user: UserTokenModel;
  loading: boolean;
};

export type UserTokenAction = {
  type: string;
  payload: UserTokenModel | undefined;
};

export default UserTokenModel;