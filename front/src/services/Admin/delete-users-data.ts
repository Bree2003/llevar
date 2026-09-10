import { AxiosDelete } from "services/utils";

import {
  UserModel,
  ArrayDataModel
} from "models/Admin/usersModel";

export interface UserDeleteResponse {
  message: string;
};

export interface ArrayDataResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export interface UsersDataResponse {
    oid: string;
    name: string;
    surname: string;
    email: string;
    domains: ArrayDataResponse[];
    permissions: ArrayDataResponse[];
    active: boolean;
    created_at: string;
    updated_at: string;
};

const ArrayModelToData = (arrayData: ArrayDataModel): ArrayDataResponse => {
    return {
        id: arrayData.id,
        name: arrayData.name,
        description: arrayData.description,
        active: arrayData.active,
        created_at: arrayData.createdAt,
        updated_at: arrayData.updatedAt,
    }
};

const UserModelToData = (user: UserModel): UsersDataResponse => {
    return {
        oid: user.oid,
        name: user.name,
        surname: user.surname,
        email: user.email,
        domains: user.domains.map(ArrayModelToData),
        permissions: user.permissions.map(ArrayModelToData),
        active: user.active,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
    }
};

const deleteUsersData = async (
  data: UserModel,
): Promise<UserDeleteResponse | undefined> => {
  const response = await AxiosDelete(`/api/users/delete`, UserModelToData(data));
  return response?.data;
};

export default deleteUsersData;
