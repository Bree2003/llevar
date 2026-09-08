import { JwtPayload } from "jwt-decode";
import { UserPermissionResponse } from "../services/get-user-permissions";

export interface MSTokenModel extends JwtPayload {
  name: string | null | undefined;
  given_name: string | null | undefined;
  family_name: string | null | undefined;
  upn:  string | null | undefined;
  unique_name:  string | null | undefined;
};

export interface ArrayModel {
  id: string;
  name: string;
  description: string;
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
  userPermissions: UserPermissionResponse
): Promise<UserTokenModel> => {
  const output: UserTokenModel = {
    username: userPermissions.name ?? "N/A",
    name: userPermissions.name ?? "N/A",
    surname: userPermissions.surname ?? "N/A",
    email: userPermissions.email ?? "N/A",
    domains: userPermissions.domains ? userPermissions.domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      description: domain.description,
      active: domain.active,
    })) : [],
    permissions: userPermissions.permissions ? userPermissions.permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      active: permission.active,
    })) : [],
    active: userPermissions.active ?? false,
  };
  return output;
};
