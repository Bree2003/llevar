import { SET_ERROR, SET_FILES, SET_LOADING, StorageActionTypes, StorageState } from "store/models/storage";


const initialState: StorageState = {
  files: [],
  loading: false,
  error: null,
};

export const storageReducer = (state = initialState, action: StorageActionTypes): StorageState => {
  switch (action.type) {
    case SET_FILES:
      return { ...state, files: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default storageReducer;
