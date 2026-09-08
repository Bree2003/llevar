import { AxiosGet } from "services/utils";

export interface FaqDataResponse {
    id: string;
    question: string;
    answer: string;
    categories: string[];
    created_at: string;
    updated_at: string;
};

const loadFaqData = async (): Promise<FaqDataResponse[] | undefined> => {
    const response = await AxiosGet('/api/faq/');
    return response?.data;
};

export default loadFaqData;
