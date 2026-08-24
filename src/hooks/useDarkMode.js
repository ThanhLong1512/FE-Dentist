import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode as toggleDarkModeAction } from "../redux/slices/themeSlice";

/** Thin hook: theme lives in Redux (UI state), not Context. */
export function useDarkMode() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();

  function toggleDarkMode() {
    dispatch(toggleDarkModeAction());
  }

  return { isDarkMode, toggleDarkMode };
}
