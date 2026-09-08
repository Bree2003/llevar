import { AxiosPost } from "services/utils";
import { FaqModel } from "models/Global/faqModel";

export interface FaqDataResponse {
    id: string;
    question: string;
    answer: string;
    created_at: string;
    updated_at: string;
};

export interface FaqDataCreation {
    id: string;
    question: string;
    answer: string;
};

const FaqModelToData = (faqData: FaqModel): FaqDataCreation => {
    return {
        id: faqData.id,
        question: faqData.question,
        answer: faqData.answer,
    }
};

const createFaqData = async (data: FaqModel): Promise<FaqDataResponse | undefined> => {
    const response = await AxiosPost(`/api/faq/`, FaqModelToData(data));
    return response?.data;
};

export default createFaqData;
