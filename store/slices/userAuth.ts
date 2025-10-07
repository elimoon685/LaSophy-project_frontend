import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type UserAuth={
    userName:string,
    userId:string;
}
const initialState:UserAuth={
userId:"",
userName:"",
}

const userAuthSlice=createSlice({
name:"auth",
initialState,
reducers:{
  setAuthInfo:(state, {payload}:PayloadAction<UserAuth>)=>{
    state.userId=payload.userId
    state.userName=payload.userName
  }
}
})
export const {setAuthInfo}=userAuthSlice.actions;
export default userAuthSlice.reducer