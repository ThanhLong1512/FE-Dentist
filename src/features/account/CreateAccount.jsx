import { Plus } from "lucide-react";
import Button from "../../components/admin/Button";
import Modal from "../../components/admin/Modal";
import CreateAccountForm from "./CreateAccountForm";

function CreateAccount() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-account">
          <Button style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <Plus size={18} />
            <span>Thêm tài khoản</span>
          </Button>
        </Modal.Open>
        <Modal.Window name="create-account">
          <CreateAccountForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateAccount;
