import { AxiosPost } from "services/utils";
import { DictionaryModel } from "models/Global/dictionaryModel";

export interface DictionaryDataResponse {
    id: string;
    name: string;
    summary: string;
    description: string;
    icon: string;
    categories: string[];
    created_at: string;
    updated_at: string;
};

export interface DictionaryDataCreation {
    id: string;
    name: string;
    summary: string;
    description: string;
    icon: string;
    categories: string[];
};

const DictionaryModelToData = (dictionaryData: DictionaryModel): DictionaryDataCreation => {
    return {
        id: dictionaryData.id,
        name: dictionaryData.name,
        summary: dictionaryData.summary,
        description: dictionaryData.description,
        icon: dictionaryData.icon,
        categories: dictionaryData.categories,
    }
};

const createDictionaryData = async (data: DictionaryModel): Promise<DictionaryDataResponse | undefined> => {
    const response = await AxiosPost(`/api/dictionary/`, DictionaryModelToData(data));
    return response?.data;
};

export default createDictionaryData;
