// store/reducers/gcsData.ts

import { SET_ENVIRONMENTS, SET_ENVIRONMENTS_LOADING } from "../actions/gcsData";
import { GcsDataAction, GcsDataState } from "../models/gcsData";

// El estado inicial de nuestra aplicación antes de cargar cualquier dato.
const initialState: GcsDataState = {
  environments: [],
  loading: true, // Empezamos en 'cargando' por defecto
};

const gcsDataReducer = (
  state: GcsDataState = initialState,
  action: GcsDataAction
): GcsDataState => {
  switch (action.type) {
    case SET_ENVIRONMENTS_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_ENVIRONMENTS:
      return {
        ...state,
        environments: action.payload || [],
        loading: false,
      };

    default:
      return state;
  }
};

export default gcsDataReducer;