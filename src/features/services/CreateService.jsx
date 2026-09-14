import { Plus } from "lucide-react";
import Button from "../../components/admin/Button";
import CreateServiceForm from "./CreateServiceForm";
import Modal from "../../components/admin/Modal";

function CreateService() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-service">
          <Button style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <Plus size={18} />
            <span>Thêm dịch vụ mới</span>
          </Button>
        </Modal.Open>
        <Modal.Window name="create-service">
          <CreateServiceForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateService;
