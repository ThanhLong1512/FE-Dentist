import { useQuery } from "@tanstack/react-query";
import { handleGetFacilities } from "../../apis";

export function useFacilities() {
  const {
    isLoading,
    data: facilities = [],
    error,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: handleGetFacilities,
  });

  return { isLoading, error, facilities: facilities || [] };
}
