import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const dentalRecordApi = {
  getDentalRecord: async (patientId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/api/v1/dental-records/patient/${patientId}`
    );
    return response.data?.data?.data;
  },

  updateMedicalHistory: async (patientId, payload) => {
    const response = await authorizedAxiosInstance.patch(
      `${API_ROOT}/api/v1/dental-records/patient/${patientId}/medical-history`,
      payload
    );
    return response.data?.data?.data;
  },

  updateTooth: async (patientId, payload) => {
    const response = await authorizedAxiosInstance.patch(
      `${API_ROOT}/api/v1/dental-records/patient/${patientId}/tooth`,
      payload
    );
    return response.data?.data?.data;
  },

  batchUpdateTeeth: async (patientId, teeth) => {
    const response = await authorizedAxiosInstance.patch(
      `${API_ROOT}/api/v1/dental-records/patient/${patientId}/teeth/batch`,
      { teeth }
    );
    return response.data?.data?.data;
  },

  addTreatmentSession: async (patientId, sessionData) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/api/v1/dental-records/patient/${patientId}/sessions`,
      sessionData
    );
    return response.data?.data?.data;
  },

  deleteTreatmentSession: async (patientId, sessionId) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/api/v1/dental-records/patient/${patientId}/sessions/${sessionId}`
    );
    return response.data?.data?.data;
  },
};
