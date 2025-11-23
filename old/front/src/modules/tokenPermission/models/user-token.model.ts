import { jwtDecode, JwtPayload } from "jwt-decode";

export interface MSTokenModel extends JwtPayload {
  name: string | null | undefined;
  given_name: string | null | undefined;
  family_name: string | null | undefined;
  upn:  string | null | undefined;
  unique_name:  string | null | undefined;
  roles:  string[] | null | undefined;
};

export interface UserTokenModel {
  username: string;
  name: string;
  surname: string;
  roles: string[];
  email: string;
}

export const UserTokenToModel = async (
  userToken: any
): Promise<UserTokenModel> => {
  const decodedToken: MSTokenModel = jwtDecode(userToken);
  const output: UserTokenModel = {
    username: decodedToken.name ? decodedToken.name : "N/A",
    name: decodedToken.given_name ? decodedToken.given_name : "N/A",
    surname: decodedToken.family_name ? decodedToken.family_name : "N/A",
    roles: decodedToken.roles ? decodedToken.roles : [] as string[],
    email: decodedToken.upn ? decodedToken.upn : (decodedToken.unique_name ? decodedToken.unique_name : "N/A"),
  };
  return output;
};
