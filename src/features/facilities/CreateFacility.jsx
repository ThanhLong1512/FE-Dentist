import { Plus } from "lucide-react";
import Button from "../../components/admin/Button";
import CreateFacilityForm from "./CreateFacilityForm";
import Modal from "../../components/admin/Modal";

function CreateFacility() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-facility">
          <Button style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <Plus size={18} />
            <span>Thêm cơ sở mới</span>
          </Button>
        </Modal.Open>
        <Modal.Window name="create-facility">
          <CreateFacilityForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateFacility;
