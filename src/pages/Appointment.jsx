import { Calendar, Clock, User, Phone, MapPin, Stethoscope } from "lucide-react";
import {
  useAppointmentSocket,
  getStoredUserId,
} from "../hooks/useAppointmentSocket";
import { APPOINTMENT_STATUS_LABELS } from "../features/appointment/appointmentStatus";
import {
  useMyAppointments,
  usePatchMyAppointmentCache,
} from "../features/appointment/useMyAppointments";
import { Link } from "react-router-dom";

function Appointment() {
  const { appointments, isLoading } = useMyAppointments();
  const patchMyAppointment = usePatchMyAppointmentCache();
  const userId = getStoredUserId();

  useAppointmentSocket({
    userId,
    role: "user",
    onAppointmentUpdated: patchMyAppointment,
    showToasts: true,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="account-page-loading">Đang tải lịch hẹn...</div>;
  }

  return (
    <div className="appt-page">
      <div className="appt-stats">
        <div className="appt-stat-card">
          <Calendar size={28} color="#1370b5" />
          <div>
            <span>Tổng lịch hẹn</span>
            <strong>{appointments.length}</strong>
          </div>
        </div>
        <div className="appt-stat-card">
          <User size={28} color="#16a34a" />
          <div>
            <span>Đã đặt</span>
            <strong>{appointments.filter((apt) => apt.patient).length}</strong>
          </div>
        </div>
        <div className="appt-stat-card">
          <Clock size={28} color="#ca8a04" />
          <div>
            <span>Sắp tới</span>
            <strong>
              {
                appointments.filter(
                  (apt) => !["cancelled", "completed"].includes(apt.status)
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="appt-empty">
          <Calendar size={40} />
          <h3>Chưa có lịch hẹn</h3>
          <p>Bạn chưa đặt lịch nào. Đặt lịch mới từ trang liên hệ.</p>
          <Link
            to="/contact"
            className="account-tab active"
            style={{ display: "inline-flex", marginTop: 12 }}
          >
            Đặt lịch ngay
          </Link>
        </div>
      ) : (
        appointments.map((appointment) => (
          <article key={appointment._id} className="appt-card">
            <div className="appt-card-head">
              <h3>{appointment.shift?.employee?.name || "Lịch hẹn"}</h3>
              <span className="appt-badge">
                {APPOINTMENT_STATUS_LABELS[appointment.status] || "Đã đặt lịch"}
              </span>
            </div>
            <div className="appt-grid">
              <div className="appt-box">
                <h4>Thời gian</h4>
                <p>
                  <Calendar size={14} /> {formatDate(appointment.Date)}
                </p>
                <p>
                  <Clock size={14} /> {appointment.shift?.StartTime} -{" "}
                  {appointment.shift?.EndTime}
                </p>
                <p>{appointment.shift?.DayOfWeek}</p>
              </div>
              <div className="appt-box">
                <h4>Bác sĩ & dịch vụ</h4>
                <p>
                  <Stethoscope size={14} />{" "}
                  {appointment.shift?.employee?.name || "-"}
                </p>
                <p>{appointment.shift?.employee?.service?.nameService || "-"}</p>
                <p>
                  <Phone size={14} /> {appointment.patient?.phoneNumber || "-"}
                </p>
                <p>
                  <MapPin size={14} /> {appointment.patient?.address || "-"}
                </p>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

export default Appointment;
