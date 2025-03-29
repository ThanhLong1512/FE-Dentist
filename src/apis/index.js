import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const handleLogoutApi = async () => {
  // Với trường hợp 01: Dùng localStorage -> chỉ xóa thông tin user trong localStorage phía Front-end
  localStorage.removeItem("userInfo");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Với trường hơp 02: Dùng HTTP Only Cookies -> Gọi APi để xử lý remove Cookie
  return await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/users/logout`
  );
};
export const handleRefreshTokenApi = async (refreshToken) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/users/refreshToken`,
    { refreshToken }
  );
};
