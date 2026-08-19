import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  handleCancelReservation,
  handlePayWithCOD,
  handlePayWithMoMo,
  handlePayWithVNPay,
  handlePayWithZaloPay,
} from "../apis";

const RESERVATION_STORAGE_KEY = "appointmentReservation";

function AppointmentCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  const reservation = useMemo(() => {
    if (location.state?.reservation) {
      sessionStorage.setItem(
        RESERVATION_STORAGE_KEY,
        JSON.stringify(location.state.reservation)
      );
      return location.state.reservation;
    }
    const stored = sessionStorage.getItem(RESERVATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }, [location.state]);

  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!reservation?.expiresAt) return 0;
    return Math.max(
      0,
      Math.floor((new Date(reservation.expiresAt).getTime() - Date.now()) / 1000)
    );
  });

  useEffect(() => {
    if (!reservation) {
      toast.error("Không tìm thấy thông tin giữ chỗ. Vui lòng đặt lịch lại.");
      navigate("/contact");
    }
  }, [reservation, navigate]);

  useEffect(() => {
    if (!reservation?.expiresAt) return undefined;

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(reservation.expiresAt).getTime() - Date.now()) / 1000
        )
      );
      setSecondsLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        toast.error("Giữ chỗ đã hết hạn. Vui lòng chọn ca khám lại.");
        sessionStorage.removeItem(RESERVATION_STORAGE_KEY);
        navigate("/contact");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation, navigate]);

  const formatCountdown = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleCancel = async () => {
    if (!reservation?.reservationId) return;

    try {
      await handleCancelReservation(reservation.reservationId);
      sessionStorage.removeItem(RESERVATION_STORAGE_KEY);
      toast.success("Đã hủy giữ chỗ");
      navigate("/contact");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể hủy giữ chỗ. Vui lòng thử lại."
      );
    }
  };

  const handlePayment = async () => {
    if (!reservation?.reservationId) return;

    const payload = {
      reservationId: reservation.reservationId,
      totalPrice: reservation.totalPrice,
      service: [reservation.serviceId],
    };

    setIsProcessing(true);

    try {
      switch (selectedPayment) {
        case "momo": {
          const res = await handlePayWithMoMo(payload);
          sessionStorage.removeItem(RESERVATION_STORAGE_KEY);
          window.location.href = res.data.payUrl;
          break;
        }
        case "zalopay": {
          const res = await handlePayWithZaloPay(payload);
          sessionStorage.removeItem(RESERVATION_STORAGE_KEY);
          window.location.href = res.data.payUrl;
          break;
        }
        case "vnpay": {
          const res = await handlePayWithVNPay(payload);
          sessionStorage.removeItem(RESERVATION_STORAGE_KEY);
          window.location.href = res.data.paymentUrl;
          break;
        }
        case "cod": {
          const res = await handlePayWithCOD(payload);
          sessionStorage.removeItem(RESERVATION_STORAGE_KEY);
          toast.success("Đặt lịch và thanh toán COD thành công!");
          navigate("/account/appointments", {
            state: { appointmentId: res.data?.appointmentId },
          });
          break;
        }
        default:
          toast.error("Phương thức thanh toán không hợp lệ");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Thanh toán thất bại. Giữ chỗ có thể đã hết hạn."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!reservation) {
    return null;
  }

  return (
    <section className="checkout-page" style={{ padding: "40px 20px" }}>
      <div className="auto-container" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 8 }}>Thanh toán đặt lịch khám</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>
          Hoàn tất thanh toán trong{" "}
          <strong style={{ color: secondsLeft <= 60 ? "#dc2626" : "#1370b5" }}>
            {formatCountdown(secondsLeft)}
          </strong>{" "}
          để giữ ca khám.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            marginBottom: 24,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Thông tin ca khám</h3>
          <p>
            <strong>Bác sĩ:</strong> {reservation.doctorName}
          </p>
          <p>
            <strong>Dịch vụ:</strong> {reservation.serviceName}
          </p>
          <p>
            <strong>Ca:</strong> {reservation.shiftTime}
          </p>
          <p>
            <strong>Ngày:</strong>{" "}
            {new Date(reservation.appointmentDate).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {Number(reservation.totalPrice || 0).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            marginBottom: 24,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Phương thức thanh toán</h3>
          {[
            { id: "cod", label: "Thanh toán khi khám (COD)" },
            { id: "momo", label: "MoMo" },
            { id: "zalopay", label: "ZaloPay" },
            { id: "vnpay", label: "VNPay" },
          ].map((method) => (
            <label
              key={method.id}
              style={{ display: "block", marginBottom: 12, cursor: "pointer" }}
            >
              <input
                type="radio"
                name="appointment-payment"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={(e) => setSelectedPayment(e.target.value)}
                style={{ marginRight: 8 }}
              />
              {method.label}
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            className="theme-btn btn-style-one"
            onClick={handlePayment}
            disabled={isProcessing || secondsLeft === 0}
          >
            {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
          <button
            type="button"
            className="theme-btn btn-style-two"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Hủy giữ chỗ
          </button>
        </div>
      </div>
    </section>
  );
}

export default AppointmentCheckout;
