import styled from "styled-components";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import Modal from "../../components/admin/Modal";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";

const PatientName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const AppointmentInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-500);
`;

const DoctorInfo = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-blue-700);
`;

const ServiceInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

const PriceInfo = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-red-700);
`;

const TimeInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-purple-700);
`;

function AppointmentRow({ appointment }) {
  const {
    _id: appointmentID,
    patient,
    Date: appointmentDate,
    shift,
  } = appointment;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      <Table.Row>
        <div>
          <PatientName>{patient.name}</PatientName>
          <AppointmentInfo>
            {patient.gender === true ? "Nam" : "Nữ"} - {patient.yearOfBirth}
          </AppointmentInfo>
        </div>

        <DoctorInfo>{shift.employee.name}</DoctorInfo>

        <ServiceInfo>{shift.employee.service.nameService}</ServiceInfo>

        <AppointmentInfo>{formatDate(appointmentDate)}</AppointmentInfo>

        <TimeInfo>
          {shift.StartTime} - {shift.EndTime}
          <br />
          <small>{shift.DayOfWeek}</small>
        </TimeInfo>

        <PriceInfo>
          {formatPrice(
            shift.employee.service.priceDiscount ||
              shift.employee.service.priceService
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
              </Menus.List>
              <Modal.Window name="view-appointment">
                <div>
                  <h3>Appointment Details</h3>
                  <p>
                    <strong>Patient:</strong> {patient.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {patient.phoneNumber}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {shift.employee.name}
                  </p>
                  <p>
                    <strong>Service:</strong>{" "}
                    {shift.employee.service.nameService}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(appointmentDate)}
                  </p>
                  <p>
                    <strong>Time:</strong> {shift.StartTime} - {shift.EndTime}
                  </p>
                  <p>
                    <strong>Price:</strong>{" "}
                    {formatPrice(
                      shift.employee.service.priceDiscount ||
                        shift.employee.service.priceService
                    )}
                  </p>
                </div>
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default AppointmentRow;
