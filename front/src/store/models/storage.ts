export const SET_FILES = "SET_FILES";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export interface StorageState {
  files: string[];
  loading: boolean;
  error: string | null;
}

interface SetFilesAction {
  type: typeof SET_FILES;
  payload: string[];
}

interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: boolean;
}

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string | null;
}

export type StorageActionTypes =
  | SetFilesAction
  | SetLoadingAction
  | SetErrorAction;
