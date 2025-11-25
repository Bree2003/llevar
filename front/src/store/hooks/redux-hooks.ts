// store/hooks/redux-hooks.ts

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../reducers';
import type { AppDispatch } from '../store';

// Usa este en lugar de `useDispatch` simple
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Usa este en lugar de `useSelector` simple
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;