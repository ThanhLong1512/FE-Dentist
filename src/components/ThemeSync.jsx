import { useEffect } from "react";
import { useSelector } from "react-redux";

/** Applies dark/light class on <html> from Redux theme slice. */
function ThemeSync() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return null;
}

export default ThemeSync;
