import { AxiosDelete } from "services/utils";
import { BannerModel } from "models/Global/bannerModel";

export interface BannerDataResponse {
    message: string;
};

const deleteBannerData = async (data: BannerModel): Promise<BannerDataResponse | undefined> => {
    const response = await AxiosDelete(`/api/banners/${data.id}`, {});
    return response?.data;
};

export default deleteBannerData;
