import { AxiosPut } from "services/utils";
import { DomainModel } from "models/Admin/domainsModel";

export interface DomainDataResponse {
    id: string;
    name: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

const DomainModelToData = (domainData: DomainModel): DomainDataResponse => {
    return {
        id: domainData.id,
        name: domainData.name,
        description: domainData.description,
        active: domainData.active,
        created_at: domainData.createdAt,
        updated_at: domainData.updatedAt,
    }
};

const updateDomainData = async (data: DomainModel): Promise<DomainDataResponse | undefined> => {
    const response = await AxiosPut(`/api/domains/${data.id}`, DomainModelToData(data));
    return response?.data;
};

export default updateDomainData;
