import { AxiosGet } from "services/utils";

export interface DomainDataResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

const loadDomainsData = async (): Promise<DomainDataResponse[] | undefined> => {
    const response = await AxiosGet('/api/domains/');
    return response?.data;
};

export default loadDomainsData;
