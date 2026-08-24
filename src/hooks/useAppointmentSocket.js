import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { SOCKET_URL } from "../utils/constants";

export function useAppointmentSocket({
  userId,
  role = "admin",
  doctorId,
  onAppointmentUpdated,
  showToasts = true,
}) {
  const socketRef = useRef(null);
  const onUpdateRef = useRef(onAppointmentUpdated);

  useEffect(() => {
    onUpdateRef.current = onAppointmentUpdated;
  }, [onAppointmentUpdated]);

  useEffect(() => {
    if (!userId || !SOCKET_URL) return undefined;

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("addUser", { userID: userId, role, doctorId });
      if (role === "admin" || role === "reception") {
        socket.emit("joinDashboard", { doctorId });
      }
    });

    socket.on("appointment:updated", (appointment) => {
      onUpdateRef.current?.(appointment);
    });

    socket.on("notification:push", ({ title, message }) => {
      if (showToasts) {
        toast(message || title, { icon: "🔔" });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, role, doctorId, showToasts]);

  return socketRef;
}

export function getStoredUserId() {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
}

export function getStoredUserRole() {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return "user";
    const user = JSON.parse(raw);
    return user?.role || "user";
  } catch {
    return "user";
  }
}
