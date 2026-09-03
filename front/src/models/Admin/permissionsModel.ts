import { PermissionDataResponse } from "services/Admin/get-permissions-data";

export interface PermissionModel {
    id: string;
    name: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export const PermissionDataToModel = (permission: PermissionDataResponse | undefined): PermissionModel | null => {
    return permission ? {
        id: permission.id,
        name: permission.name,
        description: permission.description,
        active: permission.active,
        createdAt: permission.created_at,
        updatedAt: permission.updated_at
    } : null;
};

export const PermissionsDataToModel = (permissions: PermissionDataResponse[] | undefined): PermissionModel[] => {
    return permissions ? permissions.map((permissionData) => ({
        id: permissionData.id,
        name: permissionData.name,
        description: permissionData.description,
        active: permissionData.active,
        createdAt: permissionData.created_at,
        updatedAt: permissionData.updated_at
    })) : [];
};
