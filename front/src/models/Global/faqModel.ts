import { FaqDataResponse } from "services/Global/get-faq-data";

export interface FaqModel {
    id: string;
    question: string;
    answer: string;
    categories: string[];
    createdAt: string;
    updatedAt: string;
};

export const FaqDataToModel = (faq: FaqDataResponse | undefined): FaqModel | null => {
    return faq ? {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        categories: faq.categories,
        createdAt: faq.created_at,
        updatedAt: faq.updated_at
    } : null;
};

export const FaqsDataToModel = (faqs: FaqDataResponse[] | undefined): FaqModel[] => {
    return faqs ? faqs.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        categories: faq.categories,
        createdAt: faq.created_at,
        updatedAt: faq.updated_at
    })) : [];
};
