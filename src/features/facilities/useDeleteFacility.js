import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleDeleteFacility } from "../../apis";

export function useDeleteFacility() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteFacility } = useMutation({
    mutationFn: handleDeleteFacility,
    onSuccess: () => {
      toast.success("Xóa cơ sở phòng khám thành công!");
      queryClient.invalidateQueries({
        queryKey: ["facilities"],
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Xóa cơ sở thất bại");
    },
  });

  return { isDeleting, deleteFacility };
}
