import { Plus } from "lucide-react";
import Button from "../../components/admin/Button";
import CreateEmployeeForm from "./CreateEmployeeForm";
import Modal from "../../components/admin/Modal";

function CreateEmployee() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-employee">
          <Button style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <Plus size={18} />
            <span>Thêm nhân sự</span>
          </Button>
        </Modal.Open>
        <Modal.Window name="create-employee">
          <CreateEmployeeForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateEmployee;
