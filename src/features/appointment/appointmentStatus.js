export const APPOINTMENT_STATUS_LABELS = {
  scheduled: "Đã đặt lịch",
  checked_in: "Đã đến",
  in_progress: "Đang khám",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  rescheduled: "Đã đổi lịch",
};

export const APPOINTMENT_STATUS_COLORS = {
  scheduled: "var(--color-blue-700)",
  checked_in: "var(--color-green-700)",
  in_progress: "var(--color-yellow-700)",
  completed: "var(--color-grey-600)",
  cancelled: "var(--color-red-700)",
  rescheduled: "var(--color-purple-700)",
};

export const STATUS_ACTIONS = [
  { status: "checked_in", label: "Check-in" },
  { status: "in_progress", label: "Đang khám" },
  { status: "completed", label: "Hoàn thành" },
  { status: "cancelled", label: "Hủy lịch" },
];
