import { AxiosDelete } from "services/utils";
import { DictionaryModel } from "models/Global/dictionaryModel";

export interface DictionaryDataResponse {
    message: string;
};

const deleteDictionariesData = async (data: DictionaryModel): Promise<DictionaryDataResponse | undefined> => {
    const response = await AxiosDelete(`/api/dictionary/${data.id}`, {});
    return response?.data;
};

export default deleteDictionariesData;
