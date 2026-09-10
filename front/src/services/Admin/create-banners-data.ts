import { AxiosPostForm, AxiosResponse } from "services/utils";
import { BannerModel } from "models/Global/bannerModel";

export interface BannerDataResponse {
    id: string;
    name: string;
    src: string;
    created_at: string;
    updated_at: string;
};

export interface BannerDataCreation {
    id: string;
    name: string;
};

const createBannerData = async (
    data: BannerModel,
    file: File,
    onProgress: (percent: number) => void
): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", data.name);

    return await AxiosPostForm('/api/banners/', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent); 
      }
    }
  });
};

export default createBannerData;
