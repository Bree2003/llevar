import { combineReducers } from "redux";
import UserTokenReducer from "./userToken";
import storageReducer from "./storageReducer";

const reducers = combineReducers({
  UserPermissions: UserTokenReducer,
  Storage: storageReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
