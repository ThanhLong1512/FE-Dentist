import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleDuplicateService } from "../../apis";

export function useDuplicateService() {
  const queryClient = useQueryClient();

  const { isLoading: isDuplicating, mutate: duplicateService } = useMutation({
    mutationFn: handleDuplicateService,
    onSuccess: () => {
      toast.success("Service successfully duplicated");

      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDuplicating, duplicateService };
}
