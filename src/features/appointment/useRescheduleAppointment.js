import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleRescheduleAppointment } from "../../apis";

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: reschedule } = useMutation({
    mutationFn: ({ appointmentId, payload }) =>
      handleRescheduleAppointment(appointmentId, payload),
    onSuccess: () => {
      toast.success("Đổi lịch thành công. Bệnh nhân sẽ được thông báo.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Đổi lịch thất bại");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return { isLoading, reschedule };
}
