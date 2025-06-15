import { data } from "jquery";
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
    `${API_ROOT}/api/v1/users/refreshToken`,
    {}
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
export const handleGetServices = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/services`);
  return res.data.data.data;
};

export const handleGetPatients = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/patients`);
  return res.data.data.data;
};
export const handleAddPatient = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/patients`,
    data
  );
  return res.data.data.data;
};
export const handleDuplicatePatient = async (patientID) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/patients/duplicate/${patientID}`
  );
  return res.data.data.data;
};
export const handleUpdatePatient = async (data, patientID) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/patients/${patientID}`,
    data
  );
  return res.data.data.data;
};

export const handleDeletePatient = async (patientID) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/patients/${patientID}`
  );
  return res.data;
};

export const handleGetProvince = async () => {
  const res = await authorizedAxiosInstance.get(
    `https://provinces.open-api.vn/api/`
  );
  return res.data;
};

export const handlePayWithMoMo = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/payments/paymentWithMoMo`,
    data
  );
  return res.data;
};

export const handlePayWithZaloPay = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/payments/paymentWithZaloPay`,
    data
  );
  return res.data;
};

export const handlePayWithVNPay = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/payments/paymentWithVNPay`,
    data
  );
  return res.data;
};

export const handlePayWithCOD = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/payments/paymentWithCOD`,
    data
  );
  return res.data;
};

export const handleGetService = async (serviceID) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/services/${serviceID}`
  );
  return res.data.data.data;
};

export const handleAddService = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/services`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data;
};
export const handleUpdateService = async (data, serviceID) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/services/${serviceID}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data.data;
};
export const handleDeleteService = async (serviceID) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/services/${serviceID}`
  );
  return res.data;
};
export const handleDuplicateService = async (serviceID) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/services/duplicate/${serviceID}`
  );
  return res.data.data.data;
};
export const handlePostReview = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/reviews`,
    data
  );
  return res.data;
};

export const handleDeleteReview = async (reviewID) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/reviews/${reviewID}`
  );
  return res;
};

export const handleUpdateReview = async (reviewID, data) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/reviews/${reviewID}`,
    data
  );
  return res.data;
};

export const handleGetMe = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/accounts/me`
  );
  return res.data.data.data;
};
export const handleUpdateMe = async (formDataToSend) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/accounts/updateMe`,
    formDataToSend,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data.data;
};

export const handleGetMyAppointment = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/appointments/getMyAppointment`
  );
  return res.data.data.data;
};

export const handleGetNyOrder = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/orders/getOrderByUser`
  );
  return res.data.data;
};

export const handleGetMyConservation = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/conservations/getConservationByMembers`
  );
  return res.data.data;
};

export const handleGetMessagesByConservation = async (conservationID) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/messages/${conservationID}`
  );
  return res.data.data.messages;
};

export const handleCreateConservation = async () => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/conservations`
  );
  return res.data.data;
};

export const handleCreateMessage = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/messages`,
    data
  );
  return res.data.data.data;
};
