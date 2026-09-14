import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleAddFacility } from "../../apis";

export function useCreateFacility() {
  const queryClient = useQueryClient();

  const { mutate: createFacility, isLoading: isCreating } = useMutation({
    mutationFn: handleAddFacility,
    onSuccess: () => {
      toast.success("Thêm mới cơ sở phòng khám thành công!");
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Thêm cơ sở thất bại");
    },
  });

  return { isCreating, createFacility };
}
