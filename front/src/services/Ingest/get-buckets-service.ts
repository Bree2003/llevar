import { AxiosGet } from "services/utils";

export interface BucketResponse {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
};

export const getBucketsService = async (projectId: string): Promise<BucketResponse[] | undefined> => {
  const response = await AxiosGet('/api/storage/buckets', {
    project_id: projectId,
  });
  return response?.data;
};
