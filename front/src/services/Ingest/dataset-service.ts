import { AxiosGet, AxiosPost, AxiosGetConfig } from "services/utils";

export interface DatasetPreviewResponse {
  exists: boolean;
  fileName?: string;
  columns?: string[];
  rows?: any[];
  error?: string;
}

export interface SaveDatasetResponse {
  success: boolean;
  message: string;
  path?: string;
}

export const getLatestDatasetPreviewService = async (
  envId: string, 
  bucketName: string,
  productName: string,
  tableName: string
): Promise<DatasetPreviewResponse> => {

  const path = `${productName}/${tableName}`;

  const response = await AxiosGet(
    `/api/storage/products/${path}/preview-latest`,
    {
      env_id: envId,
      bucket_name: bucketName
    }
  );

  return response?.data;
};

export const saveDatasetDataService = async (
  envId: string,
  bucketName: string,
  productName: string,
  tableName: string,
  rows: any[]
): Promise<SaveDatasetResponse> => {
  
  const payload = {
    env_id: envId,
    bucket_name: bucketName,
    product_name: productName,
    table_name: tableName,
    rows: rows,
    user: "usuario_app"
  };

  const response = await AxiosPost(
    "/api/storage/products/save-data",
    payload
  );

  return response?.data;
};


export const downloadDatasetExcelService = async (
  envId: string,
  bucketName: string,
  productName: string,
  tableName: string
): Promise<void> => {

  const path = `${productName}/${tableName}`;

  const response = await AxiosGetConfig(
    `/api/storage/products/${path}/download-excel`,
    {
      env_id: envId,
      bucket_name: bucketName,
    },
    {
      responseType: "blob",
    }
  );

  const blob = response.data;

  let fileName = `${tableName}.xlsx`;

  const contentDisposition = response?.headers?.["content-disposition"];

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+)"?/);
    if (match?.[1]) {
      fileName = match[1];
    }
  }

  const url = window.URL.createObjectURL(new Blob([blob]));

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

export const downloadMarketplaceProductExcelService = async (
  envId: string,
  bucketName: string,
  productName: string
): Promise<void> => {
  const response = await AxiosGetConfig(
    `/api/storage/marketplace/products/${productName}/download-excel`,
    {
      env_id: envId,
      bucket_name: bucketName,
    },
    {
      responseType: "blob",
    }
  );

  const blob = response.data;

  let fileName = `${productName}.xlsx`;

  const contentDisposition =
    response?.headers?.["content-disposition"];

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+)"?/);

    if (match?.[1]) {
      fileName = match[1];
    }
  }

  const url = window.URL.createObjectURL(
    new Blob([blob])
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};