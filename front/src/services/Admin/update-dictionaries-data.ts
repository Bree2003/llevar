import { AxiosPut } from "services/utils";
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

const DictionaryModelToData = (dictionaryData: DictionaryModel): DictionaryDataResponse => {
    return {
        id: dictionaryData.id,
        name: dictionaryData.name,
        summary: dictionaryData.summary,
        description: dictionaryData.description,
        icon: dictionaryData.icon,
        categories: dictionaryData.categories,
        created_at: dictionaryData.createdAt,
        updated_at: dictionaryData.updatedAt,
    }
};

const updateDictionaryData = async (data: DictionaryModel): Promise<DictionaryDataResponse | undefined> => {
    const response = await AxiosPut(`/api/dictionary/${data.id}`, DictionaryModelToData(data));
    return response?.data;
};

export default updateDictionaryData;
