import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export const middlewares = [thunk];
// @ts-ignore
const storeEnhancers = compose;

const store = createStore(
	rootReducer,
	storeEnhancers(applyMiddleware(middlewares[0]))
);

export default store;
