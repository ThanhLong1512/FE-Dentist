import { useQuery } from "@tanstack/react-query";
import { handleGetAvailableSlots } from "../../apis";

export function useAvailableSlots({ date, serviceId, employeeId, enabled }) {
  return useQuery({
    queryKey: [
      "availableSlots",
      serviceId,
      date ? (date instanceof Date ? date.toISOString() : String(date)) : "",
      employeeId || "",
    ],
    queryFn: () =>
      handleGetAvailableSlots({
        date,
        serviceId,
        employeeId,
      }),
    enabled:
      enabled !== undefined
        ? enabled
        : Boolean(date && serviceId),
  });
}
