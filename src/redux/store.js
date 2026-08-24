/**
 * Redux store — client/UI state only.
 * Server/API state belongs in TanStack React Query (features hooks).
 */
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import cartUiReducer from "./slices/cartUiSlice";
import recoveryUiReducer from "./slices/recoveryUiSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cartUi: cartUiReducer,
    recoveryUi: recoveryUiReducer,
  },
});
