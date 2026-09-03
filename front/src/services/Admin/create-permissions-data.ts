import { AxiosPost } from "services/utils";
import { PermissionModel } from "models/Admin/permissionsModel";

export interface PermissionDataResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export interface PermissionDataCreation {
    id: string;
    name: string;
    description: string;
    active: boolean;
};

const PermissionModelToData = (permissionData: PermissionModel): PermissionDataCreation => {
    return {
        id: permissionData.id,
        name: permissionData.name,
        description: permissionData.description,
        active: permissionData.active
    }
};

const createPermissionData = async (data: PermissionModel): Promise<PermissionDataResponse | undefined> => {
    const response = await AxiosPost(`/api/permissions/`, PermissionModelToData(data));
    return response?.data;
};

export default createPermissionData;
