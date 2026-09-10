import { BannerDataResponse } from "services/Global/get-banner-data";

export interface BannerModel {
    id: string;
    name: string;
    src: string;
    createdAt: string;
    updatedAt: string;
};

export const BannerDataToModel = (banner: BannerDataResponse | undefined): BannerModel | null => {
    return banner ? {
        id: banner.id,
        name: banner.name,
        src: banner.src,
        createdAt: banner.created_at,
        updatedAt: banner.updated_at,
    } : null;
};

export const BannersDataToModel = (banners: BannerDataResponse[] | undefined): BannerModel[] => {
    return banners ? banners.map((banner) => ({
        id: banner.id,
        name: banner.name,
        src: banner.src,
        createdAt: banner.created_at,
        updatedAt: banner.updated_at
    })) : [];
};
