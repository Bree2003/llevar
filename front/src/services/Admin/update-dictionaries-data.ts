import { AxiosPut } from "services/utils";
import { DictionaryModel } from "models/Global/dictionaryModel";

export interface DictionaryDataResponse {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

const DictionaryModelToData = (dictionaryData: DictionaryModel): DictionaryDataResponse => {
    return {
        id: dictionaryData.id,
        name: dictionaryData.name,
        description: dictionaryData.description,
        created_at: dictionaryData.createdAt,
        updated_at: dictionaryData.updatedAt,
    }
};

const updateDictionaryData = async (data: DictionaryModel): Promise<DictionaryDataResponse | undefined> => {
    const response = await AxiosPut(`/api/dictionary/${data.id}`, DictionaryModelToData(data));
    return response?.data;
};

export default updateDictionaryData;
