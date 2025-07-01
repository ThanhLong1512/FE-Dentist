import { useQuery } from "@tanstack/react-query";
import { handleGetOrders } from "../../apis/index";

export function useOrders() {
  const {
    isLoading,
    data: orders,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: handleGetOrders,
  });

  return { isLoading, error, orders };
}
