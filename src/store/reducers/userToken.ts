import {
  USER_TOKEN,
  USER_TOKEN_LOADING,
} from "../actions/userToken";
import UserTokenModel, {
  UserTokenAction,
  UserTokenState,
} from "../models/userToken";

const initialState: UserTokenState = {
  user: {
    username: "",
    name: "",
    surname: "",
    roles: [],
    email: "",
  },
  loading: true,
};

const UserTokenReducer = (
  state: UserTokenState = initialState,
  action: UserTokenAction
): UserTokenState => {
  switch (action.type) {
    case USER_TOKEN:
      if (action !== undefined && action.payload !== undefined) {
        const UserToken: UserTokenModel = {
          username: action.payload.username,
          name: action.payload.name,
          surname: action.payload.surname,
          roles: action.payload.roles,
          email: action.payload.email,
        };
        return { user: UserToken, loading: false };
      } else {
        return { user: state.user, loading: false };
      }
    case USER_TOKEN_LOADING:
      return { user: state.user, loading: true };
    default:
      return state;
  }
};

export default UserTokenReducer;
