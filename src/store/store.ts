import { applyMiddleware, createStore, compose } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk'; // <-- 1. Importar ThunkDispatch
import rootReducer, { RootState } from './reducers';

// <-- 2. Importar los tipos de TODAS las acciones síncronas de la aplicación
import { UserTokenAction } from './models/userToken';
import { GcsDataAction } from './models/gcsData';

export const middlewares = [thunk];
// @ts-ignore
const storeEnhancers = compose;

const store = createStore(
  rootReducer,
  storeEnhancers(applyMiddleware(middlewares[0]))
);

// --- SECCIÓN MODIFICADA ---

// 3. Crear un tipo que sea la unión de todas nuestras acciones síncronas
type AppAction = UserTokenAction | GcsDataAction;

// 4. Definir AppDispatch explícitamente como un ThunkDispatch
// Esto le dice a TypeScript: "Nuestro dispatch puede manejar thunks que operan
// en nuestro RootState, no tienen argumentos extra, y despachan acciones del tipo AppAction".
export type AppDispatch = ThunkDispatch<RootState, unknown, AppAction>;

// --- FIN DE SECCIÓN MODIFICADA ---

export default store;