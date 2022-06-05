import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { baseApi } from '@/store/api';
import userReducer from '@/store/features/user/user.slice';

const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  user: userReducer,
};
export const makeStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
export const wrapper = createWrapper<AppStore>(makeStore, { debug: false });
