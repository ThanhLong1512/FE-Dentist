import { useQuery } from "@tanstack/react-query";
import { handleGetShifts } from "../../apis/index";

export function useShifts() {
  const {
    isLoading,
    data: shifts,
    error,
  } = useQuery({
    queryKey: ["shifts"],
    queryFn: handleGetShifts,
  });

  return { isLoading, error, shifts };
}
