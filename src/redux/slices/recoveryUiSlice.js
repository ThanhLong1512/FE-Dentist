import { createSlice } from "@reduxjs/toolkit";

const recoveryUiSlice = createSlice({
  name: "recoveryUi",
  initialState: {
    email: "",
    otp: "",
    showOTPInput: false,
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload ?? "";
    },
    setOTP(state, action) {
      state.otp = action.payload ?? "";
    },
    setShowOTPInput(state, action) {
      state.showOTPInput = Boolean(action.payload);
    },
    resetRecoveryUi(state) {
      state.email = "";
      state.otp = "";
      state.showOTPInput = false;
    },
  },
});

export const { setEmail, setOTP, setShowOTPInput, resetRecoveryUi } =
  recoveryUiSlice.actions;
export default recoveryUiSlice.reducer;
