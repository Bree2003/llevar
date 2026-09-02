import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserPermissionResponse } from "../services/get-user-permissions";

export interface MSTokenModel extends JwtPayload {
  name: string | null | undefined;
  given_name: string | null | undefined;
  family_name: string | null | undefined;
  upn:  string | null | undefined;
  unique_name:  string | null | undefined;
};

export interface ArrayModel {
  name: string;
  active: boolean;
}

export interface UserTokenModel {
  username: string;
  name: string;
  surname: string;
  email: string;
  domains: ArrayModel[];
  permissions: ArrayModel[];
  active: boolean;
}

export const UserTokenToModel = async (
  userToken: any,
  userPermissions: UserPermissionResponse
): Promise<UserTokenModel> => {
  const decodedToken: MSTokenModel = jwtDecode(userToken);
  const output: UserTokenModel = {
    username: decodedToken.name ? decodedToken.name : "N/A",
    name: decodedToken.given_name ? decodedToken.given_name : "N/A",
    surname: decodedToken.family_name ? decodedToken.family_name : "N/A",
    email: decodedToken.upn ? decodedToken.upn : (decodedToken.unique_name ? decodedToken.unique_name : "N/A"),
    domains: userPermissions.domains.map((domain) => ({
      name: domain.name,
      active: domain.active,
    })),
    permissions: userPermissions.permissions.map((permission) => ({
      name: permission.name,
      active: permission.active,
    })),
    active: userPermissions.active,
  };
  return output;
};
