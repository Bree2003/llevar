export interface UserTokenModel {
  username: string;
  name: string;
  surname: string;
  roles: string[];
  email: string;
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