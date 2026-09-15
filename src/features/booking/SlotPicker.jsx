import { useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { formatLocalizedPrice } from "../../utils/dataTranslator";
import "./SlotPicker.css";

function SlotPicker({ slots = [], selectedSlotStart, onSelectSlot }) {
  const { t, language } = useLanguage();

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
              <div className="slot-doctor">
                {slot.doctorName || t("booking.doctorLabel", "Bác sĩ")}
              </div>
            </div>
            <div className="slot-time">
              {slot.slotStart} - {slot.slotEnd}
            </div>
            <div className="slot-meta">
              <span>
                {slot.durationMinutes} {t("booking.durationUnit", "phút")}
              </span>
              <span className="dot">•</span>
              <span>{formatLocalizedPrice(slot.price, language)}</span>
            </div>
          </button>
        );
      })}

      {!sorted.length && (
        <div className="slot-empty">
          {t("booking.noSlots", "Không có khung giờ phù hợp cho ngày này.")}
        </div>
      )}
    </div>
  );
}

export default SlotPicker;

