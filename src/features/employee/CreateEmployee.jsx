import Button from "../../components/admin/Button";
import CreateEmployeeForm from "./CreateEmployeeForm";
import Modal from "../../components/admin/Modal";

function CreateEmployee() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-employee">
          <Button>Add new employee</Button>
        </Modal.Open>
        <Modal.Window name="create-employee">
          <CreateEmployeeForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateEmployee;
