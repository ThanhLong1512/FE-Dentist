import { useQuery } from "@tanstack/react-query";
import { handleGetServices } from "../../apis/index";

export function useServices() {
  const {
    isLoading,
    data: services,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: handleGetServices,
    staleTime: 5 * 60 * 1000,
  });

  return { isLoading, error, services };
}
