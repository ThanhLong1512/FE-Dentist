import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleAddService } from "../../apis/";

export function useCreateService() {
  const queryClient = useQueryClient();

  const { mutate: createService, isLoading: isCreating } = useMutation({
    mutationFn: handleAddService,
    onSuccess: () => {
      toast.success("New service successfully created");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createService };
}
