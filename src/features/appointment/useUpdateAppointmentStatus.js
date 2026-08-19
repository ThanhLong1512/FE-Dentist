import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleUpdateAppointmentStatus } from "../../apis";

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: updateStatus } = useMutation({
    mutationFn: ({ appointmentId, status }) =>
      handleUpdateAppointmentStatus(appointmentId, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Cập nhật thất bại");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return { isLoading, updateStatus };
}
