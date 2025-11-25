import { FolderResponse } from "services/Ingest/folder-service";

export interface FolderModel {
  id: string;
  label: string;
}

const FolderAdapter = (data: FolderResponse): FolderModel[] => {
  if (!data || !data.tables) return [];

  return data.tables.map((tableName) => ({
    id: tableName,
    label: tableName,
  }));
};

export default FolderAdapter;