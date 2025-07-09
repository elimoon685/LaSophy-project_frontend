import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./slices/userInfo"

export const store = configureStore({
  reducer: {
    user: userInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;