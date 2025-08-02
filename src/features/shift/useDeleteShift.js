import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleDeleteShift } from "../../apis";

export function useDeletePatient() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteShift } = useMutation({
    mutationFn: handleDeleteShift,
    onSuccess: () => {
      toast.success("Shift successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["shifts"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteShift };
}
