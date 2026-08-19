import styled from "styled-components";
import { useState } from "react";
import { HiEye, HiArrowPath } from "react-icons/hi2";
import Modal from "../../components/admin/Modal";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useUpdateAppointmentStatus } from "./useUpdateAppointmentStatus";
import { useRescheduleAppointment } from "./useRescheduleAppointment";
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  STATUS_ACTIONS,
} from "./appointmentStatus";

const PatientName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
`;

const AppointmentInfo = styled.div`
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  font-weight: 500;
  color: var(--color-grey-500);
`;

const DoctorInfo = styled.div`
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  font-weight: 600;
  color: var(--color-blue-700);
`;

const ServiceInfo = styled.div`
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  font-weight: 500;
  color: var(--color-green-700);
`;

const PriceInfo = styled.div`
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  font-weight: 600;
  color: var(--color-red-700);
`;

const TimeInfo = styled.div`
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  font-weight: 500;
  color: var(--color-purple-700);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.$color || "var(--color-grey-600)"};
  background-color: ${(props) => props.$bg || "var(--color-grey-100)"};
`;

const RescheduleForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  min-width: 32rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 1.4rem;
    font-weight: 500;
  }

  input,
  textarea {
    padding: 0.8rem 1rem;
    border: 1px solid var(--color-grey-300);
    border-radius: 0.6rem;
    font-size: 1.4rem;
  }

  button {
    align-self: flex-start;
    padding: 0.8rem 1.6rem;
    border: none;
    border-radius: 0.6rem;
    background: var(--color-brand-600);
    color: white;
    font-weight: 600;
    cursor: pointer;
  }
`;

function AppointmentRow({ appointment }) {
  const {
    _id: appointmentID,
    patient = {},
    Date: appointmentDate,
    shift = {},
    status = "scheduled",
  } = appointment || {};

  const { updateStatus, isLoading: isUpdating } = useUpdateAppointmentStatus();
  const { reschedule, isLoading: isRescheduling } = useRescheduleAppointment();

  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleShift, setRescheduleShift] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  if (!appointmentID) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleStatusChange = (nextStatus) => {
    if (isUpdating) return;
    updateStatus({ appointmentId: appointmentID, status: nextStatus });
  };

  const handleRescheduleSubmit = (event) => {
    event.preventDefault();
    if (isRescheduling) return;

    const payload = { reason: rescheduleReason };
    if (rescheduleDate) payload.Date = rescheduleDate;
    if (rescheduleShift) payload.shift = rescheduleShift;

    reschedule({ appointmentId: appointmentID, payload });
  };

  const statusColor = APPOINTMENT_STATUS_COLORS[status] || APPOINTMENT_STATUS_COLORS.scheduled;

  return (
    <>
      <Table.Row>
        <div>
          <PatientName>{patient?.name || "-"}</PatientName>
          <AppointmentInfo>
            {patient?.gender === true ? "Nam" : patient?.gender === false ? "Nữ" : "-"} -{" "}
            {patient?.yearOfBirth ?? "-"}
          </AppointmentInfo>
        </div>

        <DoctorInfo>{shift?.employee?.name || "-"}</DoctorInfo>

        <ServiceInfo>{shift?.employee?.service?.nameService || "-"}</ServiceInfo>

        <AppointmentInfo>{formatDate(appointmentDate)}</AppointmentInfo>

        <TimeInfo>
          {shift?.StartTime || "-"} - {shift?.EndTime || "-"}
          <br />
          <small>{shift?.DayOfWeek || ""}</small>
        </TimeInfo>

        <div>
          <StatusBadge $color={statusColor} $bg="var(--color-grey-100)">
            {APPOINTMENT_STATUS_LABELS[status] || status}
          </StatusBadge>
        </div>

        <PriceInfo>
          {formatPrice(
            shift?.employee?.service?.priceDiscount ||
              shift?.employee?.service?.priceService ||
              0
          )}
        </PriceInfo>

        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={appointmentID} />
              <Menus.List id={appointmentID}>
                <Modal.Open opens="view-appointment">
                  <Menus.Button icon={<HiEye />}>View Details</Menus.Button>
                </Modal.Open>
                {STATUS_ACTIONS.map((action) => (
                  <Menus.Button
                    key={action.status}
                    icon={<HiArrowPath />}
                    onClick={() => handleStatusChange(action.status)}
                  >
                    {action.label}
                  </Menus.Button>
                ))}
                <Modal.Open opens="reschedule-appointment">
                  <Menus.Button icon={<HiArrowPath />}>Đổi lịch</Menus.Button>
                </Modal.Open>
              </Menus.List>
              <Modal.Window name="view-appointment">
                <div>
                  <h3>Appointment Details</h3>
                  <p>
                    <strong>Patient:</strong> {patient?.name || "-"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {patient?.phoneNumber || "-"}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {shift?.employee?.name || "-"}
                  </p>
                  <p>
                    <strong>Service:</strong>{" "}
                    {shift?.employee?.service?.nameService || "-"}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(appointmentDate)}
                  </p>
                  <p>
                    <strong>Time:</strong> {shift?.StartTime || "-"} -{" "}
                    {shift?.EndTime || "-"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {APPOINTMENT_STATUS_LABELS[status] || status}
                  </p>
                  <p>
                    <strong>Price:</strong>{" "}
                    {formatPrice(
                      shift?.employee?.service?.priceDiscount ||
                        shift?.employee?.service?.priceService ||
                        0
                    )}
                  </p>
                </div>
              </Modal.Window>
              <Modal.Window name="reschedule-appointment">
                <RescheduleForm onSubmit={handleRescheduleSubmit}>
                  <h3>Đổi lịch hẹn</h3>
                  <label>
                    Ngày mới
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Shift ID (ca mới)
                    <input
                      type="text"
                      placeholder={shift?._id || "Nhập shift ID"}
                      value={rescheduleShift}
                      onChange={(e) => setRescheduleShift(e.target.value)}
                    />
                  </label>
                  <label>
                    Lý do
                    <textarea
                      rows={3}
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                      placeholder="Bác sĩ có ca phẫu thuật..."
                    />
                  </label>
                  <button type="submit" disabled={isRescheduling}>
                    {isRescheduling ? "Đang xử lý..." : "Xác nhận đổi lịch"}
                  </button>
                </RescheduleForm>
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default AppointmentRow;
