import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { handleGetAvailableSlots } from "../../apis";

export function useAvailableSlots({ date, serviceId, employeeId, enabled }) {
  const dateKey = useMemo(() => {
    if (!date) return "";
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return String(date).slice(0, 10);
  }, [date]);

  return useQuery({
    queryKey: [
      "availableSlots",
      serviceId,
      dateKey,
      employeeId || "",
    ],
    queryFn: () =>
      handleGetAvailableSlots({
        date: dateKey,
        serviceId,
        employeeId,
      }),
    enabled:
      enabled !== undefined
        ? enabled
        : Boolean(dateKey && serviceId),
    staleTime: 60 * 1000,
  });
}
