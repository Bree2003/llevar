import { AxiosGet } from "services/utils";

export interface arrayResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
}

export interface UserPermissionResponse {
    oid: string;
    name: string;
    surname: string;
    email: string;
    domains: arrayResponse[];
    permissions: arrayResponse[];
    active: boolean;
    created_at: string;
    updated_at: string;
};


const loadUserPermissions = async (): Promise<UserPermissionResponse> => {
    const response = await AxiosGet("/api/me/permissions");
    return response?.data;
};

export default loadUserPermissions;