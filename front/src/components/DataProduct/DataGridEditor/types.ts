export interface FileData {
  fileName?: string;
  headers?: string[];
  rows?: Record<string, any>[];
  isEmpty?: boolean;
}

export interface Breadcrumbs {
  envId?: string;
  bucketName?: string;
  productName?: string;
  tableName?: string;
}

export interface DataGridPreviewProps {
  loading?: boolean;
  file?: FileData;
  breadcrumbs?: Breadcrumbs;
  onSave?: (newRows: any[]) => void;
}