import Button from "../../components/admin/Button";
import Modal from "../../components/admin/Modal";
import CreateAccountForm from "./CreateAccountForm";

function CreateAccount() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-account">
          <Button>Add new Account</Button>
        </Modal.Open>
        <Modal.Window name="create-account">
          <CreateAccountForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateAccount;
