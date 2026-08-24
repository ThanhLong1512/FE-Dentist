import { useMemo } from "react";
import "./SlotPicker.css";

const formatPrice = (price) => {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  } catch {
    return `${price || 0} VND`;
  }
};

function SlotPicker({ slots = [], selectedSlotStart, onSelectSlot }) {
  const sorted = useMemo(() => {
    const copy = [...slots];
    copy.sort((a, b) => (a.slotStart || "").localeCompare(b.slotStart || ""));
    return copy;
  }, [slots]);

  return (
    <div className="slot-picker">
      {sorted.map((slot) => {
        const selected = selectedSlotStart === slot.slotStart;
        return (
          <button
            key={`${slot.shiftId}:${slot.slotStart}`}
            type="button"
            className={selected ? "slot-card selected" : "slot-card"}
            onClick={() => onSelectSlot?.(slot)}
          >
            <div className="slot-card-top">
              <div className="slot-doctor">{slot.doctorName || "Bác sĩ"}</div>
            </div>
            <div className="slot-time">
              {slot.slotStart} - {slot.slotEnd}
            </div>
            <div className="slot-meta">
              <span>{slot.durationMinutes} phút</span>
              <span className="dot">•</span>
              <span>{formatPrice(slot.price)}</span>
            </div>
          </button>
        );
      })}

      {!sorted.length && (
        <div className="slot-empty">
          Không có khung giờ phù hợp cho ngày này.
        </div>
      )}
    </div>
  );
}

export default SlotPicker;

