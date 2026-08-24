import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleGetMyAppointment } from "../../apis";

export function useMyAppointments() {
  const {
    isLoading,
    data: appointments = [],
    error,
  } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: handleGetMyAppointment,
  });

  return { isLoading, appointments, error };
}

/** Patch a single appointment in the my-appointments cache (e.g. socket update). */
export function usePatchMyAppointmentCache() {
  const queryClient = useQueryClient();

  return (updatedAppointment) => {
    if (!updatedAppointment?._id) return;
    queryClient.setQueryData(["my-appointments"], (prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const index = list.findIndex((item) => item._id === updatedAppointment._id);
      if (index >= 0) {
        const next = [...list];
        next[index] = { ...next[index], ...updatedAppointment };
        return next;
      }
      return [updatedAppointment, ...list];
    });
  };
}
