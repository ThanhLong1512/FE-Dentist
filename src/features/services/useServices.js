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
  });

  return { isLoading, error, services };
}
