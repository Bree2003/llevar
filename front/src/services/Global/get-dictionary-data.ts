import { AxiosGet } from "services/utils";

export interface DictionaryDataResponse {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

const loadDictionaryData = async (): Promise<DictionaryDataResponse[] | undefined> => {
    const response = await AxiosGet('/api/dictionary/');
    return response?.data;
};

export default loadDictionaryData;
