import { useQuery } from "@tanstack/react-query";
import { handleGetPatients, handleSearchPatients } from "../../apis/index";

export function usePatients({ q } = {}) {
  const {
    isLoading,
    data: patients,
    error,
  } = useQuery({
    queryKey: ["patients", q || ""],
    queryFn: () =>
      q && q.trim()
        ? handleSearchPatients({ q: q.trim(), limit: 50 })
        : handleGetPatients(),
    enabled: true,
  });

  return { isLoading, error, patients: patients || [] };
}
