import axios from "axios";
import { toast } from "react-toastify";
import { handleLogoutApi, handleRefreshTokenApi } from "../apis/index";
let authorizedAxiosInstance = axios.create();
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 60;
authorizedAxiosInstance.defaults.withCredentials = true;
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
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
      location.href = "/login";
      return Promise.reject(error);
    }
    const originalRequest = error.config;
    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleRefreshTokenApi()
        .then((res) => {
          return authorizedAxiosInstance(originalRequest);
        })
        .catch((err) => {
          handleLogoutApi().then(() => {
            location.href = "/login";
          });
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);
export default authorizedAxiosInstance;
