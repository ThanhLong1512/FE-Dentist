import { useQuery } from "@tanstack/react-query";
import { handleGetAppointments } from "../../apis/index";

export function useAppointments() {
  const {
    isLoading,
    data: appointments,
    error,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: handleGetAppointments,
  });

  return { isLoading, error, patients };
}
