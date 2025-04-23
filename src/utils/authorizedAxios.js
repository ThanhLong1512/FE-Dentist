import axios from "axios";
import { toast } from "react-toastify";
import { handleLogoutApi, handleRefreshTokenApi } from "../apis/index";
let authorizedAxiosInstance = axios.create();
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 60;
// withCredentials: Sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE phục vụ trường hợp nếu chúng ta sử dụngJW
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
    // Nếu nhận mã 401 từ BE thì gọi api logout
    if (error.response?.status === 401) {
      handleLogoutApi().then(() => {
        location.href = "/login";
      });
    }
    const originalRequest = error.config;
    if (error.response?.status === 410 && !originalRequest._retry) {
      // Gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, để việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm
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
