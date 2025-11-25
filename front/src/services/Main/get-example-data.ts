import { AxiosGet } from "services/utils";

export interface ExampleDataResponse {
    name: string;
    age: number;
};


const loadExampleData = async (): Promise<ExampleDataResponse[]> => {
    const response = await AxiosGet('https://www.google.com');
    return response?.data;
};

export default loadExampleData;