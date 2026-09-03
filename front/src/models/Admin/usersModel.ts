import { UsersDataResponse, ArrayDataResponse } from "services/Admin/get-users-data";

export interface ArrayDataModel {
    id: string;
    name: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export interface UserModel {
    oid: string;
    name: string;
    surname: string;
    email: string;
    domains: ArrayDataModel[];
    permissions: ArrayDataModel[];
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

const ArrayDataToModel = (arrayData: ArrayDataResponse): ArrayDataModel => {
    return {
        id: arrayData.id,
        name: arrayData.name,
        description: arrayData.description,
        active: arrayData.active,
        createdAt: arrayData.created_at,
        updatedAt: arrayData.updated_at
    };
};

export const UserDataToModel = (user: UsersDataResponse | undefined): UserModel | null => {
    return user ? {
        oid: user.oid,
        name: user.name,
        surname: user.surname,
        email: user.email,
        domains: user.domains.map(ArrayDataToModel),
        permissions: user.permissions.map(ArrayDataToModel),
        active: user.active,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    } : null;
};

export const UsersDataToModel = (user: UsersDataResponse[] | undefined): UserModel[] => {
    return user ? user.map((userData) => ({
        oid: userData.oid,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        domains: userData.domains.map(ArrayDataToModel),
        permissions: userData.permissions.map(ArrayDataToModel),
        active: userData.active,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at
    })) : [];
};
