import axios from "axios";
import { toast } from "react-toastify";
import { handleLogoutApi, handleRefreshTokenApi } from "../apis/index";
let authorizedAxiosInstance = axios.create();
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 60;
// withCredentials: Sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE phục vụ trường hợp nếu chúng ta sử dụngJW
authorizedAxiosInstance.defaults.withCredentials = true;
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    // Cần thêm "Bear" vì chúng ta tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng JWT tokens

    config.headers.Authorization = `Bearer ${accessToken}`;

    // const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // // Kiểm tra nếu đang truy cập route admin
    // if (config.url.includes("/admin")) {
    //   // Kiểm tra quyền admin
    //   if (!userInfo || userInfo.role !== "admin") {
    //     // Chuyển hướng hoặc ném lỗi
    //     window.location.href = "/home";
    //     return Promise.reject(new Error("Unauthorized"));
    //   }
    // }
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
    // Nếu nhận mã 410 từ BE thì gọi api refreshToken để làm mới accessToken
    // B1: Lấy refresh Token từ localStorage hoặc Cookie
    // Cách 1: Lấy refreshToke từ localStorage
    const originalRequest = error.config;

    const refreshTokenFromLocalStorage = localStorage.getItem("refreshToken");
    if (error.response?.status === 41 && !originalRequest._retry) {
      // Gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, để việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm
      originalRequest._retry = true;

      return handleRefreshTokenApi(refreshTokenFromLocalStorage)
        .then((res) => {
          // Nếu trả về thành công từ API thì gán accessToken vào localStorage hoặc Cookie
          // Cách 1: Trương hợp gán lại accessToken từ localStorage
          const { accessToken } = res.data;
          localStorage.setItem("accessToken", accessToken);
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          // Bước cuối cùng: return lại axios instance của chúng ta kết hợp cái originalConfig để gọi lại những api ban đầu bị lỗi
          return authorizedAxiosInstance(originalRequest);
        })
        .catch((err) => {
          // Nếu nhận bất kỳ lỗi nào từ api refresh token thì sẽ logout luôn
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
