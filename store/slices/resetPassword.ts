import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EmailValue {
  email: string
}
const initialState: EmailValue = {
  email: ""
}

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmail: (state, { payload }: PayloadAction<EmailValue["email"]>) => {
      state.email = payload
    },
    cleanEmail: (state) => {
      state.email = ""
    }
  }
});

export const { setEmail, cleanEmail } = emailSlice.actions;
export default emailSlice.reducer;