import { useQuery } from "@tanstack/react-query";
import { handleGetPatients } from "../../apis/index";

export function usePatients() {
  const {
    isLoading,
    data: patients,
    error,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: handleGetPatients,
  });

  return { isLoading, error, patients };
}
