import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { handleAddPatient } from "../../apis/";

export function useCreatePatient() {
  const queryClient = useQueryClient();

  const { mutate: createPatient, isLoading: isCreating } = useMutation({
    mutationFn: handleAddPatient,
    onSuccess: () => {
      toast.success("New patient successfully created");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createPatient };
}
