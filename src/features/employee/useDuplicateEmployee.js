import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleDuplicateEmployee } from "../../apis";

export function useDuplicateEmployee() {
  const queryClient = useQueryClient();

  const { isLoading: isDuplicating, mutate: duplicateEmployee } = useMutation({
    mutationFn: handleDuplicateEmployee,
    onSuccess: () => {
      toast.success("Employee successfully duplicated");

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDuplicating, duplicateEmployee };
}
