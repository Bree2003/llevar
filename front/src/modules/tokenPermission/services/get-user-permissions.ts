import { AxiosGet } from "services/utils";

export interface arrayResponse {
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
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