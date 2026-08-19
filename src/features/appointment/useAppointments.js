import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  handleGetAppointments,
  handleSearchAppointments,
} from "../../apis/index";
import {
  useAppointmentSocket,
  getStoredUserId,
  getStoredUserRole,
} from "../../hooks/useAppointmentSocket";

export function useAppointments({ q } = {}) {
  const queryClient = useQueryClient();
  const userId = getStoredUserId();
  const role = getStoredUserRole();

  const {
    isLoading,
    data: appointments,
    error,
  } = useQuery({
    queryKey: ["appointments", q || ""],
    queryFn: () => {
      if (q && q.trim()) {
        return handleSearchAppointments({ q: q.trim(), limit: 200 }).then(
          (items) =>
            (items || []).map((it) => ({
              _id: it.id,
              Date: it.date,
              status: it.status,
              patient: {
                name: it.patientName,
                phoneNumber: it.patientPhone,
                gender: null,
                yearOfBirth: null,
              },
              shift: {
                StartTime: it.slotStart,
                EndTime: it.slotEnd,
                DayOfWeek: "",
                employee: {
                  name: it.doctorName,
                  service: {
                    nameService: it.serviceName,
                    priceService: it.priceService,
                    priceDiscount: it.priceDiscount,
                  },
                },
              },
            }))
        );
      }
      return handleGetAppointments();
    },
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
