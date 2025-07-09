import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    userInfo: {
      userName: string;
      email: string;
      bio: string|null;
      createdAt:string
    } | null;
  }
  const initialState: UserState = {
    userInfo: null,
  };
  const userSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
      setUserInfo(state, action: PayloadAction<UserState["userInfo"]>) {
        state.userInfo = action.payload;
      },
    },
  });
  export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;