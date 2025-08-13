import styled from "styled-components";
import { useState } from "react";

import CreateEmployeeForm from "./CreateEmployeeForm";
import { useDeleteEmployee } from "./useDeleteEmployee";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateEmployee } from "./useCreateEmployee";
import { useDuplicateEmployee } from "./useDuplicateEmployee";
import Modal from "../../components/admin/Modal";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

const Name = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Phone = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-500);
`;

const Email = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-blue-700);
  font-size: 1.4rem;
`;

const Gender = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: ${(props) =>
    props.gender ? "var(--color-pink-700)" : "var(--color-blue-700)"};
`;

const Experience = styled.div`
  font-family: "Sono";
  font-weight: 400;
  color: var(--color-grey-600);
  font-size: 1.3rem;
`;

function EmployeeRow({ employee }) {
  const { isDeleting, deleteEmployee } = useDeleteEmployee();
  const { isDuplicating, duplicateEmployee } = useDuplicateEmployee();

  const {
    _id: employeeId,
    name,
    phoneNumber,
    gender,
    email,
    experience,
    photo,
    description,
  } = employee;

  function handleDuplicate() {
    duplicateEmployee(employeeId);
  }

  return (
    <>
      <Table.Row>
        <div>
          <Name>{name}</Name>
          <Experience>{experience}</Experience>
        </div>
        <Phone>{phoneNumber}</Phone>
        <Gender gender={gender}>{gender ? "Female" : "Male"}</Gender>
        <Email>{email}</Email>
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={employeeId} />
              <Menus.List id={employeeId}>
                <Menus.Button
                  icon={<HiSquare2Stack />}
                  onClick={handleDuplicate}
                  disabled={isDuplicating}
                >
                  Duplicate
                </Menus.Button>
                <Modal.Open opens="edit-employee">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="delete-employee">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>
              <Modal.Window name="edit-employee">
                <CreateEmployeeForm employeeToEdit={employee} />
              </Modal.Window>
              <Modal.Window name="delete-employee">
                <ConfirmDelete
                  resource="employee"
                  onConfirm={() => deleteEmployee(employeeId)}
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

export default EmployeeRow;
