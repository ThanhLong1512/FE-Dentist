import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateShift } from "../../apis";
import { toast } from "react-hot-toast";

export function useEditPatient() {
  const queryClient = useQueryClient();

  const { mutate: editShift, isLoading: isEditing } = useMutation({
    mutationFn: ({ newShiftData, id }) => handleUpdateShift(newShiftData, id),
    onSuccess: () => {
      toast.success("Shift updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editShift };
}
