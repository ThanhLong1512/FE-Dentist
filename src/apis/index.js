import { data } from "jquery";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { clearAuthSession } from "../utils/authStorage";
import { API_ROOT } from "../utils/constants";

export const handleLogoutApi = async () => {
  clearAuthSession();
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
    `${API_ROOT}/api/v1/payments/paymentWithVnPay`,
    data
  );
  return res.data;
};

export const handleHoldAppointment = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/appointments/hold`,
    data
  );
  return res.data;
};

export const handleCancelReservation = async (reservationId) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/appointments/reservations/${reservationId}/cancel`
  );
  return res.data;
};

export const handleGetShiftsByDayAndDate = async (dayOfWeek, date) => {
  const dateKey = date.toISOString().slice(0, 10);
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/shifts/${dayOfWeek}?date=${dateKey}`
  );
  return res.data.data;
};

export const handleGetAvailableSlots = async ({ date, serviceId, employeeId }) => {
  const dateKey = date.toISOString().slice(0, 10);
  const params = new URLSearchParams({
    date: dateKey,
    serviceId: String(serviceId),
  });
  if (employeeId) params.set("employeeId", String(employeeId));

  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/availability/slots?${params.toString()}`
  );
  return res.data.data;
};

export const handleSearchPatients = async ({ q, limit = 10 }) => {
  const params = new URLSearchParams({
    q: String(q),
    limit: String(limit),
  });
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/search/patients?${params.toString()}`
  );
  return res.data.data;
};

export const handleSearchAppointments = async ({
  q,
  patientId,
  from,
  to,
  limit = 10,
}) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (q) params.set("q", String(q));
  if (patientId) params.set("patientId", String(patientId));
  if (from) params.set("from", String(from));
  if (to) params.set("to", String(to));

  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/search/appointments?${params.toString()}`
  );
  return res.data.data;
};

export const handleSearchServices = async ({ q, limit = 10 }) => {
  const params = new URLSearchParams({
    q: String(q),
    limit: String(limit),
  });
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/search/services?${params.toString()}`
  );
  return res.data.data;
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
  try {
    const res = await authorizedAxiosInstance.get(
      `${API_ROOT}/api/v1/appointments/getMyAppointment`
    );
    return res.data.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};
export const handleGetAppointments = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/appointments`
  );
  const data = res.data?.data?.data ?? res.data?.data;
  return Array.isArray(data) ? data : [];
};

export const handleUpdateAppointmentStatus = async (appointmentId, status) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/appointments/${appointmentId}/status`,
    { status }
  );
  return res.data;
};

export const handleRescheduleAppointment = async (appointmentId, payload) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/appointments/${appointmentId}/reschedule`,
    payload
  );
  return res.data;
};
export const handleGetNyOrder = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/orders/getOrderByUser`
  );
  const data = res.data?.data || {};
  return {
    codOrders: Array.isArray(data.codOrders) ? data.codOrders : [],
    paidOrders: Array.isArray(data.paidOrders) ? data.paidOrders : [],
  };
};

export const handleGetOrders = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/orders`);
  const data = res.data?.data?.data ?? res.data?.data;
  return Array.isArray(data) ? data : [];
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

export const handleGetShifts = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/shifts`);
  return res.data.data.data;
};
export const handleCreateShift = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/shifts`,
    data
  );
  return res.data.data.data;
};
export const handleUpdateShift = async (data, shiftID) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/shifts/${shiftID}`,
    data
  );
  return res.data.data.data;
};
export const handleDeleteShift = async (shiftID) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/shifts/${shiftID}`
  );
  return res.data;
};

export const handleGetEmployees = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/employees`);
  return res.data.data.data;
};

export const handleCreateEmployee = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/employees`,
    data
  );
  return res.data.data.data;
};

export const handleUpdateEmployee = async (data, employeeID) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/employees/${employeeID}`,
    data
  );
  return res.data.data.data;
};

export const handleDeleteEmployee = async (employeeID) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/employees/${employeeID}`
  );
  return res.data;
};

export const handleDuplicateEmployee = async (employeeID) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/employees/${employeeID}`
  );
  return res.data.data.data;
};

export const handleGetAccounts = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/accounts`);
  return res.data.data.data;
};

export const handleUpdateAccount = async (data, accountID) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/accounts/${accountID}`,
    data
  );
  return res.data.data.data;
};

export const handleDeleteAccount = async (accountID) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/v1/accounts/${accountID}`
  );
  return res.data;
};

export const handleGetAppointmentByPeriod = async (period) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/appointments/getByPeriod/${period}`
  );
  return res.data.data;
};

export const handleGetRevenueByPeriod = async (period) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/orders/getRevenueByPeriod/${period}`
  );
  return res.data.data;
};

export const handleGetReviewsByPeriod = async (period) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/v1/reviews/getReviewStatsByPeriod/${period}`
  );
  return res.data.data;
};
