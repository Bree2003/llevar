import { DictionaryDataResponse } from "services/Global/get-dictionary-data";

export interface DictionaryModel {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
};

export const DictionaryDataToModel = (dict: DictionaryDataResponse | undefined): DictionaryModel | null => {
    return dict ? {
        id: dict.id,
        name: dict.name,
        description: dict.description,
        createdAt: dict.created_at,
        updatedAt: dict.updated_at
    } : null;
};

export const DictionariesDataToModel = (dicts: DictionaryDataResponse[] | undefined): DictionaryModel[] => {
    return dicts ? dicts.map((dict) => ({
        id: dict.id,
        name: dict.name,
        description: dict.description,
        createdAt: dict.created_at,
        updatedAt: dict.updated_at
    })) : [];
};
