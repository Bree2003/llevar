import { AxiosDelete } from "services/utils";
import { FaqModel } from "models/Global/faqModel";

export interface DictionaryDataResponse {
    message: string;
};

const deleteDictionariesData = async (data: FaqModel): Promise<DictionaryDataResponse | undefined> => {
    const response = await AxiosDelete(`/api/dictionary/${data.id}`, {});
    return response?.data;
};

export default deleteDictionariesData;
