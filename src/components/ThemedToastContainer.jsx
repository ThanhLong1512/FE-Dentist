import { ToastContainer } from "react-toastify";
import { useDarkMode } from "../context/DarkModeContext";
import "react-toastify/dist/ReactToastify.css";

function ThemedToastContainer() {
  const { isDarkMode } = useDarkMode();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? "dark" : "light"}
    />
  );
}

export default ThemedToastContainer;
