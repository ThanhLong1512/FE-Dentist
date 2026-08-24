import { useQuery } from "@tanstack/react-query";
import { handleGetNyOrder } from "../../apis";

export function useMyOrders() {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      try {
        return await handleGetNyOrder();
      } catch (err) {
        if (err.response?.status === 404) {
          return { codOrders: [], paidOrders: [] };
        }
        throw err;
      }
    },
  });

  return {
    isLoading,
    error,
    codOrders: data?.codOrders || [],
    paidOrders: data?.paidOrders || [],
  };
}
