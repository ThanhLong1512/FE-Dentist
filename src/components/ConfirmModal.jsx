import React, { useEffect } from "react";
import { AlertTriangle, Trash2, Info, X } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

/**
 * Reusable Confirmation Modal with modern aesthetics and dark mode support.
 *
 * @param {boolean} isOpen - Whether modal is displayed
 * @param {Function} onClose - Callback when user closes or cancels
 * @param {Function} onConfirm - Callback when user confirms action
 * @param {string} title - Modal heading
 * @param {string} message - Descriptive text
 * @param {string} [confirmText="Xác nhận"] - Confirm button label
 * @param {string} [cancelText="Hủy"] - Cancel button label
 * @param {string} [variant="danger"] - "danger" | "warning" | "info"
 * @param {boolean} [isLoading=false] - If true, displays loading state on confirm button
 */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  isLoading = false,
}) {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
          iconColor: "#ef4444",
          buttonBg: "#dc2626",
          buttonHover: "#b91c1c",
          IconComponent: Trash2,
        };
      case "warning":
        return {
          iconBg: isDarkMode ? "rgba(245, 158, 11, 0.15)" : "#fef3c7",
          iconColor: "#f59e0b",
          buttonBg: "#d97706",
          buttonHover: "#b45309",
          IconComponent: AlertTriangle,
        };
      case "info":
      default:
        return {
          iconBg: isDarkMode ? "rgba(2, 132, 199, 0.15)" : "#e0f2fe",
          iconColor: "#0284c7",
          buttonBg: "#0284c7",
          buttonHover: "#0369a1",
          IconComponent: Info,
        };
    }
  };

  const { iconBg, iconColor, buttonBg, buttonHover, IconComponent } =
    getVariantStyles();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "cmFadeIn 0.2s ease-out forwards",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "20px",
          backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
          color: isDarkMode ? "#f8fafc" : "#0f172a",
          border: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid #e2e8f0",
          boxShadow: isDarkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
          padding: "24px",
          position: "relative",
          animation: "cmScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          fontFamily: "inherit",
        }}
      >
        {/* Close Button */}
        {!isLoading && (
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "transparent",
              border: "none",
              color: isDarkMode ? "#94a3b8" : "#64748b",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode
                ? "rgba(255, 255, 255, 0.08)"
                : "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* Content */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: iconBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconComponent size={24} />
          </div>

          <div style={{ flex: 1, paddingTop: "2px" }}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "17px",
                fontWeight: 700,
                color: isDarkMode ? "#ffffff" : "#0f172a",
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.5,
                color: isDarkMode ? "#94a3b8" : "#64748b",
              }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: isDarkMode ? "1px solid #334155" : "1px solid #cbd5e1",
              backgroundColor: "transparent",
              color: isDarkMode ? "#cbd5e1" : "#475569",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? "#334155"
                  : "#f1f5f9";
                e.currentTarget.style.color = isDarkMode ? "#ffffff" : "#0f172a";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = isDarkMode ? "#cbd5e1" : "#475569";
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: buttonBg,
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "all 0.15s",
              opacity: isLoading ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = buttonHover;
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = buttonBg;
            }}
          >
            {isLoading && (
              <span
                style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  border: "2px solid #ffffff",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "cmSpin 0.7s linear infinite",
                }}
              />
            )}
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cmScaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes cmSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
