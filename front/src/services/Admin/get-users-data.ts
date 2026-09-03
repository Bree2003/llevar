import { AxiosGet } from "services/utils";

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

const loadUsersData = async (): Promise<UsersDataResponse[] | undefined> => {
    const response = await AxiosGet('/api/users/');
    return response?.data;
};

export default loadUsersData;
