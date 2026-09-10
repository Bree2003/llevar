import { BucketResponse } from "services/Ingest/get-buckets-service";

export interface BucketModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const BucketDataToModel = (data: BucketResponse[] | undefined): BucketModel[] => {
  if (!data || !Array.isArray(data)) return [];

  const output: BucketModel[] = [];
  for (const item of data) {
    output.push({
      id: item.id,
      name: item.name,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    });
  }

  return output;
};
