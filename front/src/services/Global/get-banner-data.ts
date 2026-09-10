import { AxiosGet } from "services/utils";

export interface BannerDataResponse {
    id: string;
    name: string;
    src: string;
    created_at: string;
    updated_at: string;
};

const loadBannerData = async (): Promise<BannerDataResponse[] | undefined> => {
    const response = await AxiosGet('/api/banners/');
    return response?.data;
};

export default loadBannerData;
