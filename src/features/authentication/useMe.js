import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleGetMe, handleUpdateMe } from "../../apis";

export function useMe() {
  const {
    isLoading,
    data: me,
    error,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: handleGetMe,
  });

  return { isLoading, me, error, refetch };
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateMe, isLoading: isUpdating } = useMutation({
    mutationFn: handleUpdateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return { updateMe, isUpdating };
}
