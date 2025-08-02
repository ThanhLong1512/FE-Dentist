import styled from "styled-components";
import { useState } from "react";

import CreatePatientForm from "./CreateShiftForm";
import { useDeletePatient } from "./useDeleteShift";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../components/admin/Modal";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";

const PatientName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const PatientInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-500);
`;

const ContactInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-blue-700);
`;

function PatientRow({ patient }) {
  const { isDeleting, deletePatient } = useDeletePatient();
  const {
    _id: patientID,
    name,
    gender,
    yearOfBirth,
    phoneNumber,
    address,
  } = patient;

  return (
    <>
      <Table.Row>
        <PatientName>{name}</PatientName>
        <PatientInfo>{gender === true ? "Nam" : "Nữ"}</PatientInfo>
        <PatientInfo>{yearOfBirth}</PatientInfo>
        <ContactInfo>{phoneNumber}</ContactInfo>
        <PatientInfo>{address}</PatientInfo>
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={patientID} />
              <Menus.List id={patientID}>
                <Modal.Open opens="edit-patient">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="delete-patient">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>
              <Modal.Window name="edit-patient">
                <CreatePatientForm patientToEdit={patient} />
              </Modal.Window>
              <Modal.Window name="delete-patient">
                <ConfirmDelete
                  resource="patient"
                  onConfirm={() => deletePatient(patientID)}
                  disabled={isDeleting}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default PatientRow;
