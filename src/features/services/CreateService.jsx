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

// function CreateService() {
//   const [isOpenModal, setIsOpenModal] = useState(false);
//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal((show) => !show)}>
//         Add new service
//       </Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <CreateServiceForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

export default CreateService;
