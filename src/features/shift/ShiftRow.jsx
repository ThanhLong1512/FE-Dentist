import styled from "styled-components";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Modal from "../../components/admin/Modal";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import CreateShiftForm from "./CreateShiftForm";
import { useDeleteShift } from "./useDeleteShift";
import { useCreateShift } from "./useCreateShift";
import toast from "react-hot-toast";

const Employee = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Service = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
`;

const Day = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Time = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-600);
`;

const Status = styled.span`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: var(--border-radius-sm);

  /* Make these dynamic, based on the received prop */
  color: ${(props) =>
    props.type === "available"
      ? "var(--color-green-700)"
      : "var(--color-red-700)"};
  background-color: ${(props) =>
    props.type === "available"
      ? "var(--color-green-100)"
      : "var(--color-red-100)"};
`;

function ShiftRow({ shift }) {
  const { isDeleting, deleteShift } = useDeleteShift();
  const { isCreating, createShift } = useCreateShift();

  const {
    _id: shiftId,
    employee,
    DayOfWeek,
    StartTime,
    EndTime,
    isBooked,
  } = shift;

  const employeeName = employee?.name || "No Employee";
  const serviceName = employee?.service?.nameService || "No Service";
  const status = isBooked ? "booked" : "available";

  function handleDuplicate() {
    const duplicateShiftData = {
      employee: employee?._id,
      DayOfWeek,
      StartTime,
      EndTime,
      isBooked: false,
    };

    createShift(duplicateShiftData, {
      onSuccess: () => {
        toast.success("Shift duplicated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to duplicate shift: ${error.message}`);
      },
    });
  }

  function handleDelete() {
    deleteShift(shiftId, {
      onSuccess: () => {
        toast.success("Shift deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete shift: ${error.message}`);
      },
    });
  }

  return (
    <Table.Row>
      <Employee>{employeeName}</Employee>
      <Service>{serviceName}</Service>
      <Day>{DayOfWeek}</Day>
      <Time>{StartTime}</Time>
      <Time>{EndTime}</Time>
      <Status type={status}>{status}</Status>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={shiftId} />

            <Menus.List id={shiftId}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicate
              </Menus.Button>

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateShiftForm shiftToEdit={shift} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="shift"
                disabled={isDeleting}
                onConfirm={handleDelete}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default ShiftRow;
