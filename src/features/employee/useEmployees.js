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
    staleTime: 5 * 60 * 1000,
  });

  return { isLoading, error, employees };
}
