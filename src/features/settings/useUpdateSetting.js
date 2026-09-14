import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleUpdateSettings } from "../../apis";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: handleUpdateSettings,
    onSuccess: () => {
      toast.success("Cài đặt hệ thống đã được cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Cập nhật cài đặt thất bại"
      );
    },
  });

  return { isUpdating, updateSetting };
}
