import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { dentalRecordApi } from "../../apis/dentalRecordApi";

export function useDentalRecord(patientId) {
  const {
    data: record,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dentalRecord", patientId],
    queryFn: () => dentalRecordApi.getDentalRecord(patientId),
    enabled: Boolean(patientId),
  });

  return { record, isLoading, error, refetch };
}

export function useUpdateMedicalHistory() {
  const queryClient = useQueryClient();

  const { mutate: updateMedicalHistory, isLoading: isUpdating } = useMutation({
    mutationFn: ({ patientId, payload }) =>
      dentalRecordApi.updateMedicalHistory(patientId, payload),
    onSuccess: (updatedRecord, { patientId }) => {
      toast.success("Đã cập nhật tiền sử bệnh lý");
      queryClient.setQueryData(["dentalRecord", patientId], updatedRecord);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Lỗi khi cập nhật");
    },
  });

  return { updateMedicalHistory, isUpdating };
}

export function useUpdateTooth() {
  const queryClient = useQueryClient();

  const { mutate: updateTooth, isLoading: isUpdating } = useMutation({
    mutationFn: ({ patientId, toothData }) =>
      dentalRecordApi.updateTooth(patientId, toothData),
    onSuccess: (updatedRecord, { patientId }) => {
      queryClient.setQueryData(["dentalRecord", patientId], updatedRecord);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Lỗi cập nhật răng");
    },
  });

  return { updateTooth, isUpdating };
}

export function useBatchUpdateTeeth() {
  const queryClient = useQueryClient();

  const { mutate: batchUpdateTeeth, isLoading: isUpdating } = useMutation({
    mutationFn: ({ patientId, teeth }) =>
      dentalRecordApi.batchUpdateTeeth(patientId, teeth),
    onSuccess: (updatedRecord, { patientId }) => {
      toast.success("Đã cập nhật sơ đồ răng");
      queryClient.setQueryData(["dentalRecord", patientId], updatedRecord);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Lỗi cập nhật");
    },
  });

  return { batchUpdateTeeth, isUpdating };
}

export function useAddTreatmentSession() {
  const queryClient = useQueryClient();

  const { mutate: addSession, isLoading: isAdding } = useMutation({
    mutationFn: ({ patientId, sessionData }) =>
      dentalRecordApi.addTreatmentSession(patientId, sessionData),
    onSuccess: (updatedRecord, { patientId }) => {
      toast.success("Đã thêm lượt điều trị mới");
      queryClient.setQueryData(["dentalRecord", patientId], updatedRecord);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Lỗi thêm lượt điều trị");
    },
  });

  return { addSession, isAdding };
}

export function useDeleteTreatmentSession() {
  const queryClient = useQueryClient();

  const { mutate: deleteSession, isLoading: isDeleting } = useMutation({
    mutationFn: ({ patientId, sessionId }) =>
      dentalRecordApi.deleteTreatmentSession(patientId, sessionId),
    onSuccess: (updatedRecord, { patientId }) => {
      toast.success("Đã xóa lượt điều trị");
      queryClient.setQueryData(["dentalRecord", patientId], updatedRecord);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Lỗi xóa lượt điều trị");
    },
  });

  return { deleteSession, isDeleting };
}
