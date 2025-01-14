import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { toolsSliceReducer } from './tools/tools';

const rootReducer = combineReducers({
  toolsReducer: toolsSliceReducer,
});

export const store = configureStore({
  reducer: {
    mainReducer: rootReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type TypeRootState = ReturnType<typeof store.getState>;
