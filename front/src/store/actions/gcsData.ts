// store/actions/gcsData.ts

// --- NUEVOS IMPORTS ---
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
// --- FIN DE NUEVOS IMPORTS ---

import { EnvironmentModel, GcsDataAction } from "../models/gcsData";
import { getEnvironmentsService } from 'services/gcs-data-service';

export const SET_ENVIRONMENTS_LOADING = "SET_ENVIRONMENTS_LOADING";
export const SET_ENVIRONMENTS = "SET_ENVIRONMENTS";

export const setEnvironmentsLoading = (): GcsDataAction => ({
  type: SET_ENVIRONMENTS_LOADING,
});

export const setEnvironments = (environments: EnvironmentModel[]): GcsDataAction => ({
  type: SET_ENVIRONMENTS,
  payload: environments,
});

// --- ACCIÓN ASÍNCRONA (THUNK) MODIFICADA ---

// Ahora, la función devuelve explícitamente el tipo ThunkAction.
// ThunkAction<ReturnType, StateType, ExtraArgumentType, ActionType>
export const loadEnvironments =
  (): ThunkAction<void, RootState, unknown, GcsDataAction> =>
  async (dispatch) => {
    // El 'dispatch' aquí ahora está correctamente tipado gracias a ThunkAction
    dispatch(setEnvironmentsLoading());

    try {
      const response = await getEnvironmentsService();

      if (response.status === 200) {
        dispatch(setEnvironments(response.data));
      } else {
        console.error("Failed to fetch environments:", response.data);
        dispatch(setEnvironments([]));
      }
    } catch (error) {
      console.error("Error in loadEnvironments action:", error);
      dispatch(setEnvironments([]));
    }
  };