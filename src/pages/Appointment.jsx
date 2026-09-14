import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Plus,
  Navigation,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  useAppointmentSocket,
  getStoredUserId,
} from "../hooks/useAppointmentSocket";
import { APPOINTMENT_STATUS_LABELS } from "../features/appointment/appointmentStatus";
import {
  useMyAppointments,
  usePatchMyAppointmentCache,
} from "../features/appointment/useMyAppointments";
import "./Appointment.css";

function Appointment() {
  const { appointments = [], isLoading } = useMyAppointments();
  const patchMyAppointment = usePatchMyAppointmentCache();
  const userId = getStoredUserId();
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'upcoming' | 'completed' | 'cancelled'

  useAppointmentSocket({
    userId,
    role: "user",
    onAppointmentUpdated: patchMyAppointment,
    showToasts: true,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const upcomingAppointments = appointments.filter(
    (apt) => !["cancelled", "completed"].includes(apt.status)
  );

  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  );

  const cancelledAppointments = appointments.filter(
    (apt) => apt.status === "cancelled"
  );

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus === "upcoming")
      return !["cancelled", "completed"].includes(apt.status);
    if (filterStatus === "completed") return apt.status === "completed";
    if (filterStatus === "cancelled") return apt.status === "cancelled";
    return true;
  });

  const getStatusBadge = (status) => {
    const label = APPOINTMENT_STATUS_LABELS[status] || "Đã đặt lịch";
    let statusClass = "scheduled";

    if (status === "checked_in") statusClass = "checked_in";
    else if (status === "in_progress") statusClass = "in_progress";
    else if (status === "completed") statusClass = "completed";
    else if (status === "cancelled") statusClass = "cancelled";
    else if (status === "rescheduled") statusClass = "rescheduled";

    return (
      <span className={`appt-status-badge ${statusClass}`}>
        {status === "completed" ? (
          <CheckCircle2 size={13} />
        ) : status === "cancelled" ? (
          <AlertCircle size={13} />
        ) : (
          <Clock size={13} />
        )}
        <span>{label}</span>
      </span>
    );
  };

  if (isLoading) {
    return <div className="account-page-loading">Đang tải danh sách lịch hẹn...</div>;
  }

  return (
    <div className="appt-container">
      {/* 1. Header Card */}
      <section className="appt-header-card">
        <div className="appt-header-info">
          <h1>Lịch hẹn khám của tôi</h1>
          <p>
            Theo dõi lịch hẹn khám nha khoa, bác sĩ phụ trách và thời gian điều trị
          </p>
        </div>
        <Link to="/booking" className="btn-new-appointment">
          <Plus size={16} />
          <span>Đặt lịch khám mới</span>
        </Link>
      </section>

      {/* 2. Stats Overview */}
      <div className="appt-stats-grid">
        <div className="appt-stat-card-modern">
          <div className="appt-stat-icon-bubble blue">
            <Calendar size={22} />
          </div>
          <div className="appt-stat-text">
            <span>Tổng số lịch hẹn</span>
            <strong>{appointments.length}</strong>
          </div>
        </div>

        <div className="appt-stat-card-modern">
          <div className="appt-stat-icon-bubble amber">
            <Clock size={22} />
          </div>
          <div className="appt-stat-text">
            <span>Lịch khám sắp tới</span>
            <strong>{upcomingAppointments.length}</strong>
          </div>
        </div>

        <div className="appt-stat-card-modern">
          <div className="appt-stat-icon-bubble green">
            <CheckCircle2 size={22} />
          </div>
          <div className="appt-stat-text">
            <span>Đã hoàn thành</span>
            <strong>{completedAppointments.length}</strong>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="appt-filter-bar">
        <button
          type="button"
          className={`appt-filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          <span>Tất cả</span>
          <span className="appt-count-badge">{appointments.length}</span>
        </button>

        <button
          type="button"
          className={`appt-filter-btn ${
            filterStatus === "upcoming" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("upcoming")}
        >
          <span>Sắp tới</span>
          <span className="appt-count-badge">
            {upcomingAppointments.length}
          </span>
        </button>

        <button
          type="button"
          className={`appt-filter-btn ${
            filterStatus === "completed" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("completed")}
        >
          <span>Đã hoàn thành</span>
          <span className="appt-count-badge">
            {completedAppointments.length}
          </span>
        </button>

        <button
          type="button"
          className={`appt-filter-btn ${
            filterStatus === "cancelled" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("cancelled")}
        >
          <span>Đã hủy</span>
          <span className="appt-count-badge">
            {cancelledAppointments.length}
          </span>
        </button>
      </div>

      {/* 4. Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="appt-empty-card">
          <div className="appt-empty-icon-bubble">
            <Calendar size={32} />
          </div>
          <h2>Chưa có lịch hẹn nào</h2>
          <p>
            Bạn hiện không có lịch khám nha khoa nào trong mục này. Hãy chọn bác sĩ
            chuyên khoa và đặt lịch khám để được thăm khám định kỳ!
          </p>
          <Link to="/booking" className="btn-new-appointment">
            <Sparkles size={16} />
            <span>Đặt lịch khám ngay</span>
          </Link>
        </div>
      ) : (
        <div className="appt-list">
          {filteredAppointments.map((appointment) => (
            <article key={appointment._id} className="appt-card-modern">
              {/* Header */}
              <div className="appt-card-header">
                <div className="appt-doctor-lead">
                  <div className="appt-doctor-avatar-circle">
                    <Stethoscope size={20} />
                  </div>
                  <div className="appt-doctor-details">
                    <h3>
                      {appointment.shift?.employee?.name
                        ? `Bác sĩ: ${appointment.shift.employee.name}`
                        : "Bác sĩ chuyên khoa Răng Hàm Mặt"}
                    </h3>
                    <span>
                      {appointment.shift?.employee?.service?.nameService ||
                        "Khám & Điều trị tổng quát"}
                    </span>
                  </div>
                </div>

                {getStatusBadge(appointment.status)}
              </div>

              {/* Body Grid */}
              <div className="appt-card-body-grid">
                {/* Time Info */}
                <div className="appt-info-block">
                  <h4 className="appt-block-title">
                    <Clock size={15} />
                    <span>Thời gian khám</span>
                  </h4>
                  <div className="appt-info-rows">
                    <div className="appt-row-item">
                      <Calendar size={15} />
                      <span>{formatDate(appointment.Date)}</span>
                    </div>
                    <div className="appt-row-item">
                      <Clock size={15} />
                      <span style={{ fontWeight: 700, color: "#0284c7" }}>
                        {appointment.shift?.StartTime || "08:00"} -{" "}
                        {appointment.shift?.EndTime || "09:00"}
                      </span>
                    </div>
                    {appointment.shift?.DayOfWeek && (
                      <div className="appt-row-item">
                        <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                          Ca khám: {appointment.shift.DayOfWeek}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Patient & Location Info */}
                <div className="appt-info-block">
                  <h4 className="appt-block-title">
                    <User size={15} />
                    <span>Bệnh nhân & Cơ sở</span>
                  </h4>
                  <div className="appt-info-rows">
                    <div className="appt-row-item">
                      <User size={15} />
                      <span>
                        Bệnh nhân:{" "}
                        <strong>
                          {appointment.patient?.name || "Người dùng"}
                        </strong>
                      </span>
                    </div>
                    <div className="appt-row-item">
                      <Phone size={15} />
                      <span>
                        Điện thoại: {appointment.patient?.phoneNumber || "-"}
                      </span>
                    </div>
                    <div className="appt-row-item">
                      <MapPin size={15} />
                      <span>
                        Cơ sở:{" "}
                        {appointment.patient?.address ||
                          "Phòng khám Nha Khoa Quốc Tế DENTIST PRO"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="appt-card-footer">
                <div className="appt-reminder-note">
                  <Clock size={14} />
                  <span>
                    Vui lòng đến trước 10 phút để được đón tiếp và làm thủ tục kiểm tra.
                  </span>
                </div>

                <div className="appt-action-btns">
                  <Link to="/contact" className="btn-action-outline">
                    <Navigation size={13} />
                    <span>Chỉ đường</span>
                  </Link>
                  <Link to="/booking" className="btn-action-primary">
                    <span>Đặt lại lịch</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointment;
