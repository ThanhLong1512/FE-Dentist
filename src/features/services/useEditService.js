// hooks/useEditService.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService } from "../services/apiServices";
import toast from "react-hot-toast";

export function useEditService() {
  const queryClient = useQueryClient();

  const { mutate: editService, isLoading: isEditing } = useMutation({
    mutationFn: ({ newServiceData, id }) => updateService(id, newServiceData),
    onSuccess: () => {
      toast.success("Service successfully updated");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update service");
      console.error("Edit service error:", err);
    },
  });

  return { isEditing, editService };
}
