import { useQuery } from "@tanstack/react-query";
import { handleGetEmployees } from "../../apis/index";

export function useEmployees() {
  const {
    isLoading,
    data: employees,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: handleGetEmployees,
  });

  return { isLoading, error, employees };
}
