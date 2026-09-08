import { DictionaryDataResponse } from "services/Global/get-dictionary-data";

export interface DictionaryModel {
    id: string;
    name: string;
    summary: string;
    description: string;
    icon: string;
    categories: string[];
    createdAt: string;
    updatedAt: string;
};

export const DictionaryDataToModel = (dict: DictionaryDataResponse | undefined): DictionaryModel | null => {
    return dict ? {
        id: dict.id,
        name: dict.name,
        summary: dict.summary,
        description: dict.description,
        icon: dict.icon,
        categories: dict.categories,
        createdAt: dict.created_at,
        updatedAt: dict.updated_at
    } : null;
};

export const DictionariesDataToModel = (dicts: DictionaryDataResponse[] | undefined): DictionaryModel[] => {
    return dicts ? dicts.map((dict) => ({
        id: dict.id,
        name: dict.name,
        summary: dict.summary,
        description: dict.description,
        icon: dict.icon,
        categories: dict.categories,
        createdAt: dict.created_at,
        updatedAt: dict.updated_at
    })) : [];
};
