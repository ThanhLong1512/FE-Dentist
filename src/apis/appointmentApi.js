import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const appointmentApi = {
  getShiftsByDayAndDate: async (dayOfWeek, date) => {
    const dateKey = date.toISOString().slice(0, 10);
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/api/v1/shifts/${dayOfWeek}?date=${dateKey}`
    );
    return response.data.data;
  },

  holdAppointment: async ({ shift, Date: appointmentDate }) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/api/v1/appointments/hold`,
      { shift, Date: appointmentDate }
    );
    return response.data;
  },

  cancelReservation: async (reservationId) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/api/v1/appointments/reservations/${reservationId}/cancel`
    );
    return response.data;
  },
};
