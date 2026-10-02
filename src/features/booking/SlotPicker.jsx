import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { formatLocalizedPrice } from "../../utils/dataTranslator";
import { ChevronLeft, ChevronRight, Sun, Sunset, Clock } from "lucide-react";
import "./SlotPicker.css";

function SlotPicker({ slots = [], selectedSlotStart, onSelectSlot, pageSize = 8 }) {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState("all"); // "all" | "morning" | "afternoon"

  // Reset page to 1 whenever slots prop changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slots]);

  // Sort slots by start time
  const sorted = useMemo(() => {
    const copy = [...slots];
    copy.sort((a, b) => (a.slotStart || "").localeCompare(b.slotStart || ""));
    return copy;
  }, [slots]);

  // Count by time of day
  const morningCount = useMemo(
    () => sorted.filter((s) => (s.slotStart || "") < "12:00").length,
    [sorted]
  );
  const afternoonCount = useMemo(
    () => sorted.filter((s) => (s.slotStart || "") >= "12:00").length,
    [sorted]
  );

  // Filter slots based on selected session
  const filteredSlots = useMemo(() => {
    if (timeFilter === "morning") {
      return sorted.filter((s) => (s.slotStart || "") < "12:00");
    }
    if (timeFilter === "afternoon") {
      return sorted.filter((s) => (s.slotStart || "") >= "12:00");
    }
    return sorted;
  }, [sorted, timeFilter]);

  const totalPages = Math.ceil(filteredSlots.length / pageSize) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // Paginated slots for the current page
  const paginatedSlots = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredSlots.slice(start, start + pageSize);
  }, [filteredSlots, safePage, pageSize]);

  // Auto switch to page containing the selected slot
  useEffect(() => {
    if (selectedSlotStart) {
      const slotIndex = filteredSlots.findIndex(
        (s) => s.slotStart === selectedSlotStart
      );
      if (slotIndex !== -1) {
        const targetPage = Math.floor(slotIndex / pageSize) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    }
  }, [selectedSlotStart, filteredSlots, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, filteredSlots.length);

  const getLabel = (key, fallback) => {
    const val = t(key);
    return val && val !== key ? val : fallback;
  };

  return (
    <div className="slot-picker-container">
      {/* Session Filter Pills (Tất cả / Sáng / Chiều) */}
      {sorted.length > 0 && (
        <div className="slot-session-tabs">
          <button
            type="button"
            className={`slot-session-btn ${timeFilter === "all" ? "active" : ""}`}
            onClick={() => {
              setTimeFilter("all");
              setCurrentPage(1);
            }}
          >
            <Clock size={15} />
            <span>{getLabel("booking.allSlots", "Tất cả")}</span>
            <span className="slot-tab-badge">{sorted.length}</span>
          </button>

          <button
            type="button"
            className={`slot-session-btn ${timeFilter === "morning" ? "active" : ""}`}
            onClick={() => {
              setTimeFilter("morning");
              setCurrentPage(1);
            }}
          >
            <Sun size={15} />
            <span>
              {getLabel("booking.morningSlots", "Buổi sáng (08:00 - 12:00)")}
            </span>
            <span className="slot-tab-badge">{morningCount}</span>
          </button>

          <button
            type="button"
            className={`slot-session-btn ${timeFilter === "afternoon" ? "active" : ""}`}
            onClick={() => {
              setTimeFilter("afternoon");
              setCurrentPage(1);
            }}
          >
            <Sunset size={15} />
            <span>
              {getLabel("booking.afternoonSlots", "Buổi chiều (12:00 - 18:00)")}
            </span>
            <span className="slot-tab-badge">{afternoonCount}</span>
          </button>
        </div>
      )}

      {/* Grid of slot cards */}
      <div className="slot-picker">
        {paginatedSlots.map((slot) => {
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

        {!filteredSlots.length && (
          <div className="slot-empty">
            {t("booking.noSlots", "Không có khung giờ phù hợp cho ngày này.")}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="slot-pagination">
          <div className="slot-pagination-info">
            {language === "en"
              ? `Showing ${startIndex}-${endIndex} of ${filteredSlots.length} slots`
              : `Hiển thị ${startIndex} - ${endIndex} / ${filteredSlots.length} khung giờ`}
          </div>

          <div className="slot-pagination-controls">
            <button
              type="button"
              className="slot-page-arrow"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              title={language === "en" ? "Previous page" : "Trang trước"}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`slot-page-num ${safePage === pageNum ? "active" : ""}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              className="slot-page-arrow"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              title={language === "en" ? "Next page" : "Trang tiếp theo"}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlotPicker;
