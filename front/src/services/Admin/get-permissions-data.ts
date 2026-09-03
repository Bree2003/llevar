import { AxiosGet } from "services/utils";

export interface PermissionDataResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

const loadPermissionsData = async (): Promise<PermissionDataResponse[] | undefined> => {
    const response = await AxiosGet('/api/permissions/');
    return response?.data;
};

export default loadPermissionsData;
