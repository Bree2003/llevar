// store/reducers/index.ts

import { combineReducers } from "redux";
import UserTokenReducer from "./userToken";
import gcsDataReducer from "./gcsData"; // <-- IMPORTAMOS NUESTRO NUEVO REDUCER

const reducers = combineReducers({
  UserPermissions: UserTokenReducer,
  GcsData: gcsDataReducer, // <-- AÑADIMOS NUESTRO REDUCER AL ESTADO GLOBAL
});

export default reducers;

// El RootState ahora incluirá nuestro nuevo estado, haciéndolo disponible
// en toda la app a través de useTypedSelector.
export type RootState = ReturnType<typeof reducers>;