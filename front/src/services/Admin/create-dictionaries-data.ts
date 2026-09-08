import { AxiosPost } from "services/utils";
import { DictionaryModel } from "models/Global/dictionaryModel";

export interface DictionaryDataResponse {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

export interface DictionaryDataCreation {
    id: string;
    name: string;
    description: string;
};

const DictionaryModelToData = (dictionaryData: DictionaryModel): DictionaryDataCreation => {
    return {
        id: dictionaryData.id,
        name: dictionaryData.name,
        description: dictionaryData.description,
    }
};

const createDictionaryData = async (data: DictionaryModel): Promise<DictionaryDataResponse | undefined> => {
    const response = await AxiosPost(`/api/dictionary/`, DictionaryModelToData(data));
    return response?.data;
};

export default createDictionaryData;
