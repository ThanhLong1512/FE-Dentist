import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleDeleteAccount } from "../../apis";

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteAccount } = useMutation({
    mutationFn: handleDeleteAccount,
    onMutate: async (accountId) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });
      const previousAccounts = queryClient.getQueryData(["accounts"]);
      queryClient.setQueryData(["accounts"], (old) =>
        Array.isArray(old) ? old.filter((acc) => acc._id !== accountId) : old
      );
      return { previousAccounts };
    },
    onSuccess: () => {
      toast.success("Tài khoản đã được xóa thành công");
    },
    onError: (err, _accountId, context) => {
      if (context?.previousAccounts != null) {
        queryClient.setQueryData(["accounts"], context.previousAccounts);
      }
      toast.error(
        err.response?.data?.message || err.message || "Không thể xóa tài khoản"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return { isDeleting, deleteAccount };
}
