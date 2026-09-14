import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleCreateBatchShifts } from "../../apis";

export function useCreateBatchShifts() {
  const queryClient = useQueryClient();

  const { mutate: createBatchShifts, isLoading: isBatchCreating } = useMutation({
    mutationFn: handleCreateBatchShifts,
    onSuccess: (data) => {
      const created = data?.createdCount ?? 0;
      const skipped = data?.skippedCount ?? 0;
      if (created > 0) {
        toast.success(
          `Đã tạo thành công ${created} ca làm việc!${
            skipped > 0 ? ` (Bỏ qua ${skipped} ca trùng)` : ""
          }`
        );
      } else if (skipped > 0) {
        toast("Tất cả ca đã chọn đều đã tồn tại từ trước!", { icon: "ℹ️" });
      }
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  return { isBatchCreating, createBatchShifts };
}
