import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleCreateShift } from "../../apis";

export function useCreatePatient() {
  const queryClient = useQueryClient();

  const { mutate: createShift, isLoading: isCreating } = useMutation({
    mutationFn: handleCreateShift,
    onSuccess: () => {
      toast.success("New shift successfully created");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createShift };
}
