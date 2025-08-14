import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleRegister } from "../../apis";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  const { mutate: createAccount, isLoading: isCreating } = useMutation({
    mutationFn: handleRegister,
    onSuccess: () => {
      toast.success("New account successfully created");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createAccount };
}
