import { useQuery } from "@tanstack/react-query";
import { handleGetService } from "../../apis/index";

export function useService(serviceId) {
  const {
    isLoading,
    data: service,
    error,
  } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => handleGetService(serviceId),
    enabled: !!serviceId,
  });

  return { isLoading, error, service };
}
