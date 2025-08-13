import Button from "../../components/admin/Button";
import Modal from "../../components/admin/Modal";
import CreateShiftForm from "./CreateShiftForm";

function CreatePatient() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-shift">
          <Button>Add new Shift</Button>
        </Modal.Open>
        <Modal.Window name="create-shift">
          <CreateShiftForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreatePatient;
