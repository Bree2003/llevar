import { combineReducers } from "redux";
import UserTokenReducer from "./userToken";

const reducers = combineReducers({
  UserPermissions: UserTokenReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
