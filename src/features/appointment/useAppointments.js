import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleGetAppointments } from "../../apis/index";
import {
  useAppointmentSocket,
  getStoredUserId,
  getStoredUserRole,
} from "../../hooks/useAppointmentSocket";

export function useAppointments() {
  const queryClient = useQueryClient();
  const userId = getStoredUserId();
  const role = getStoredUserRole();

  const {
    isLoading,
    data: appointments,
    error,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: handleGetAppointments,
  });

  const handleAppointmentUpdated = useCallback(
    (updatedAppointment) => {
      if (!updatedAppointment?._id) return;

      queryClient.setQueryData(["appointments"], (old) => {
        const list = Array.isArray(old) ? old : [];
        const index = list.findIndex((item) => item._id === updatedAppointment._id);

        if (index >= 0) {
          const next = [...list];
          next[index] = { ...next[index], ...updatedAppointment };
          return next;
        }

        return [updatedAppointment, ...list];
      });
    },
    [queryClient]
  );

  useAppointmentSocket({
    userId,
    role,
    onAppointmentUpdated: handleAppointmentUpdated,
    showToasts: role === "admin",
  });

  return { isLoading, error, appointments: appointments || [] };
}
