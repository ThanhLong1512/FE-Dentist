import { createSlice } from "@reduxjs/toolkit";

function readStoredDarkMode() {
  try {
    const raw = localStorage.getItem("isDarkMode");
    if (raw === null) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return JSON.parse(raw) === true;
  } catch {
    return false;
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkMode: readStoredDarkMode(),
  },
  reducers: {
    setDarkMode(state, action) {
      state.isDarkMode = Boolean(action.payload);
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode));
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode));
    },
  },
});

export const { setDarkMode, toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
