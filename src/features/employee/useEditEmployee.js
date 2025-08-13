import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateEmployee } from "../../apis";
import { toast } from "react-hot-toast";

export function useEditEmployee() {
  const queryClient = useQueryClient();

  const { mutate: editEmployee, isLoading: isEditing } = useMutation({
    mutationFn: ({ newEmployeeData, id }) =>
      handleUpdateEmployee(newEmployeeData, id),
    onSuccess: () => {
      toast.success("Employee updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editEmployee };
}
