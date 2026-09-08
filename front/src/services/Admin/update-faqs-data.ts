import { AxiosPut } from "services/utils";
import { FaqModel } from "models/Global/faqModel";

export interface FaqDataResponse {
    id: string;
    question: string;
    answer: string;
    created_at: string;
    updated_at: string;
};

const FaqModelToData = (faqData: FaqModel): FaqDataResponse => {
    return {
        id: faqData.id,
        question: faqData.question,
        answer: faqData.answer,
        created_at: faqData.createdAt,
        updated_at: faqData.updatedAt,
    }
};

const updateFaqData = async (data: FaqModel): Promise<FaqDataResponse | undefined> => {
    const response = await AxiosPut(`/api/faq/${data.id}`, FaqModelToData(data));
    return response?.data;
};

export default updateFaqData;
