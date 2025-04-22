import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const appointmentApi = {
  getShiftsByDay: async (dayOfWeek) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/api/v1/shifts/${dayOfWeek}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/api/v1/appointments`,
        appointmentData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
