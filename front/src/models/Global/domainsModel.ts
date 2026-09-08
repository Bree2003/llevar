import { DomainDataResponse } from "services/Admin/get-domains-data";

export interface DomainModel {
    id: string;
    name: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export const DomainDataToModel = (domain: DomainDataResponse | undefined): DomainModel | null => {
    return domain ? {
        id: domain.id,
        name: domain.name,
        description: domain.description,
        active: domain.active,
        createdAt: domain.created_at,
        updatedAt: domain.updated_at
    } : null;
};

export const DomainsDataToModel = (domains: DomainDataResponse[] | undefined): DomainModel[] => {
    return domains ? domains.map((domainData) => ({
        id: domainData.id,
        name: domainData.name,
        description: domainData.description,
        active: domainData.active,
        createdAt: domainData.created_at,
        updatedAt: domainData.updated_at
    })) : [];
};
