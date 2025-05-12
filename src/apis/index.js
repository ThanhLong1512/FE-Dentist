import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const handleLogoutApi = async () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cart");
  return await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/users/logout`
  );
};
export const handleRefreshTokenApi = async () => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/users/refreshToken`
  );
};

export const get2FA_QRCodeAPI = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/users/get_2fa_qr_code`
  );
  return res.data;
};

export const handleRegister = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/users/register`,
    data
  );
  return res.data;
};

export const handleLogin = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/users/login`,
    data
  );
  return res;
};

export const handleSendRecoveryEmail = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/users/send_recovery_email`,
    data
  );
  return res.data;
};
export const handleResetPassword = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/users/reset_password`,
    data
  );
  return res.data;
};
export const handleGetService = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/services`);
  return res.data;
};

export const handleGetProvince = async () => {
  const res = await authorizedAxiosInstance.get(
    `https://provinces.open-api.vn/api/`
  );
  return res.data;
};
