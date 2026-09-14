import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateFacility } from "../../apis";
import { toast } from "react-hot-toast";

export function useEditFacility() {
  const queryClient = useQueryClient();

  const { mutate: editFacility, isLoading: isEditing } = useMutation({
    mutationFn: ({ newFacilityData, id }) =>
      handleUpdateFacility(newFacilityData, id),
    onSuccess: () => {
      toast.success("Cập nhật thông tin cơ sở thành công!");
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Cập nhật cơ sở thất bại");
    },
  });

  return { isEditing, editFacility };
}
