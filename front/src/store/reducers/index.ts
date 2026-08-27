// store/reducers/index.ts

import { combineReducers } from "redux";
import UserTokenReducer from "./userToken";

const reducers = combineReducers({
  UserPermissions: UserTokenReducer,
});

export default reducers;

// El RootState ahora incluirá nuestro nuevo estado, haciéndolo disponible
// en toda la app a través de useTypedSelector.
export type RootState = ReturnType<typeof reducers>;