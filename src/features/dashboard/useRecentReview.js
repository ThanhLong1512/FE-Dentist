import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { handleGetReviewsByPeriod } from "../../apis";

export function useRecentReview() {
  const [searchParams] = useSearchParams();
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const { isLoading, data: reviews } = useQuery({
    queryFn: () => handleGetReviewsByPeriod(numDays),
    queryKey: ["reviews", `last-${numDays}`],
  });
  return { isLoading, reviews };
}
