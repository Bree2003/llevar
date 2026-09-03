import { AxiosPut } from "services/utils";
import { PermissionModel } from "models/Admin/permissionsModel";

export interface PermissionDataResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

const PermissionModelToData = (permissionData: PermissionModel): PermissionDataResponse => {
    return {
        id: permissionData.id,
        name: permissionData.name,
        description: permissionData.description,
        active: permissionData.active,
        created_at: permissionData.createdAt,
        updated_at: permissionData.updatedAt,
    }
};

const updatePermissionData = async (data: PermissionModel): Promise<PermissionDataResponse | undefined> => {
    const response = await AxiosPut(`/api/permissions/${data.id}`, PermissionModelToData(data));
    return response?.data;
};

export default updatePermissionData;
