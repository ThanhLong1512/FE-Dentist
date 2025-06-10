import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleDeleteService } from "../../apis";

export function useDeleteService() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteService } = useMutation({
    mutationFn: handleDeleteService,
    onSuccess: () => {
      toast.success("Service successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteService };
}
