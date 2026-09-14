import { Plus } from "lucide-react";
import Button from "../../components/admin/Button";
import CreatePatientForm from "./CreatePatientForm";
import Modal from "../../components/admin/Modal";

function CreatePatient() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-patient">
          <Button style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <Plus size={18} />
            <span>Thêm bệnh nhân</span>
          </Button>
        </Modal.Open>
        <Modal.Window name="create-patient">
          <CreatePatientForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreatePatient;
