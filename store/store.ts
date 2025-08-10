import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./slices/userInfo"
import emailReducer from "./slices/resetPassword"; 
export const store = configureStore({
  reducer: {
    user: userInfoReducer,
    email: emailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;