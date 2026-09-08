import { AxiosDelete } from "services/utils";
import { FaqModel } from "models/Global/faqModel";

export interface FaqDataResponse {
    message: string;
};

const deleteFaqData = async (data: FaqModel): Promise<FaqDataResponse | undefined> => {
    const response = await AxiosDelete(`/api/faq/${data.id}`, {});
    return response?.data;
};

export default deleteFaqData;
