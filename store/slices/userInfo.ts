import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    userInfo: {
      userName: string|null;
      email: string|null;
      bio: string|null;
      createdAt:string|null
    } ;
  }
  const initialState: UserState = {
    userInfo: {
      userName:null,
      email:null,
      bio:null,
      createdAt:null
    },

  };
  //
  const userSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
      setUserInfo:(state, action: PayloadAction<UserState["userInfo"]>)=>{
        state.userInfo = action.payload;
      },
    },
  });
  //
  export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;