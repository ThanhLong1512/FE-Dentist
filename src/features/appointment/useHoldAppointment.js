import { useMutation } from "@tanstack/react-query";
import { handleHoldAppointment } from "../../apis";

export function useHoldAppointment() {
  return useMutation({
    mutationFn: handleHoldAppointment,
  });
}
