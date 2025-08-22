import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { handleGetAppointmentByPeriod } from "../../apis";

export function useRecentBookings() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const { isLoading, data: bookings } = useQuery({
    queryFn: () => handleGetAppointmentByPeriod(numDays),
    queryKey: ["bookings", `last-${numDays}`],
  });
  return { isLoading, bookings };
}
