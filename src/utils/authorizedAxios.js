import axios from "axios";
import { handleLogoutApi, handleRefreshTokenApi } from "../apis/index";
import {
  clearAuthSession,
  getAccessToken,
  setAccessToken,
} from "./authStorage";

const authorizedAxiosInstance = axios.create();
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 60;
authorizedAxiosInstance.defaults.withCredentials = true;

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const isProtectedRoute = () => {
  const path = window.location.pathname;
  return (
    path.startsWith("/account") ||
    path.startsWith("/admin") ||
    path.startsWith("/checkout") ||
    path.startsWith("/appointment/checkout")
  );
};

const redirectToLogin = () => {
  clearAuthSession();
  if (isProtectedRoute()) {
    window.location.href = "/login";
  }
};

authorizedAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.includes("/login") ||
      error.config?.url?.includes("/register");

    const originalRequest = error.config;

    if (error.response?.status === 410 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleRefreshTokenApi()
        .then((res) => {
          if (res.data?.accessTokenNew) {
            setAccessToken(res.data.accessTokenNew);
          }
          return authorizedAxiosInstance(originalRequest);
        })
        .catch((err) => {
          handleLogoutApi().finally(() => {
            redirectToLogin();
          });
          return Promise.reject(err);
        });
    }

    if (error.response?.status === 401 && !isAuthRequest) {
      const hadToken = Boolean(getAccessToken());
      clearAuthSession();

      if (isProtectedRoute()) {
        import("react-toastify").then(({ toast }) => {
          toast.error(
            error.response?.data?.message ||
              "Vui lòng đăng nhập để tiếp tục tính năng này!",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        });
        window.location.href = "/login";
      } else if (hadToken) {
        // If token was expired during normal browsing, clear session silently or notify gently
        console.warn("Phiên làm việc đã hết hạn.");
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
