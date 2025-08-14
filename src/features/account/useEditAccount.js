import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateAccount } from "../../apis";
import { toast } from "react-hot-toast";

export function useEditAccount() {
  const queryClient = useQueryClient();
  const { mutate: editAccount, isLoading: isEditing } = useMutation({
    mutationFn: ({ newAccountData, id }) =>
      handleUpdateAccount(newAccountData, id),
    onSuccess: () => {
      toast.success("Account updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editAccount };
}
