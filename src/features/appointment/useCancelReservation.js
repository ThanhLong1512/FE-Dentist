import { useMutation } from "@tanstack/react-query";
import { handleCancelReservation } from "../../apis";

export function useCancelReservation() {
  return useMutation({
    mutationFn: handleCancelReservation,
  });
}
