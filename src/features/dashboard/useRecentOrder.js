import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { handleGetRevenueByPeriod } from "../../apis";

export function useRecentOrder() {
  const [searchParams] = useSearchParams();
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const { isLoading, data: orders } = useQuery({
    queryFn: () => handleGetRevenueByPeriod(numDays),
    queryKey: ["orders", `last-${numDays}`],
  });
  return { isLoading, orders };
}
