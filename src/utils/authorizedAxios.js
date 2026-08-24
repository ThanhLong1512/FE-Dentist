import axios from "axios";
import { toast } from "react-toastify";
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

const redirectToLogin = () => {
  clearAuthSession();
  window.location.href = "/login";
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
      toast.error(
        error.response?.data?.message ||
          "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!",
        {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      redirectToLogin();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
