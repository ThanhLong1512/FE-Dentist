import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateService } from "../../apis";
import { toast } from "react-hot-toast";

export function useEditService() {
  const queryClient = useQueryClient();

  const { mutate: editService, isLoading: isEditing } = useMutation({
    mutationFn: ({ newServiceData, id }) =>
      handleUpdateService(newServiceData, id),
    onSuccess: () => {
      toast.success("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editService };
}
