import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdatePatient } from "../../apis";
import { toast } from "react-hot-toast";

export function useEditPatient() {
  const queryClient = useQueryClient();

  const { mutate: editPatient, isLoading: isEditing } = useMutation({
    mutationFn: ({ newPatientData, id }) =>
      handleUpdatePatient(newPatientData, id),
    onSuccess: () => {
      toast.success("Patient updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editPatient };
}
