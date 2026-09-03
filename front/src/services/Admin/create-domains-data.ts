import { AxiosPost } from "services/utils";
import { DomainModel } from "models/Admin/domainsModel";

export interface DomainDataResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export interface DomainDataCreation {
    id: string;
    name: string;
    description: string;
    active: boolean;
};

const DomainModelToData = (domainData: DomainModel): DomainDataCreation => {
    return {
        id: domainData.id,
        name: domainData.name,
        description: domainData.description,
        active: domainData.active
    }
};

const createDomainData = async (data: DomainModel): Promise<DomainDataResponse | undefined> => {
    const response = await AxiosPost(`/api/domains/`, DomainModelToData(data));
    return response?.data;
};

export default createDomainData;
