import Button from "../../components/admin/Button";
import CreatePatientForm from "./CreatePatientForm";
import Modal from "../../components/admin/Modal";
import { useState } from "react";

function CreatePatient() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="create-patient">
          <Button>Add new patient</Button>
        </Modal.Open>
        <Modal.Window name="create-patient">
          <CreatePatientForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreatePatient;
