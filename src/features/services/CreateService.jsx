import Button from "../../components/admin/Button";
import CreateServiceForm from "./CreateServiceForm";
import Modal from "../../components/admin/Modal";
import { useState } from "react";

function CreateService() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-service">
          <Button>Add new service</Button>
        </Modal.Open>
        <Modal.Window name="create-service">
          <CreateServiceForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateService;
