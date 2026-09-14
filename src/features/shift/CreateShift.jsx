import Button from "../../components/admin/Button";
import Modal from "../../components/admin/Modal";
import CreateShiftForm from "./CreateShiftForm";
import BatchCreateShiftForm from "./BatchCreateShiftForm";
import styled from "styled-components";
import { Sparkles, Plus } from "lucide-react";

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1.6rem;
`;

function CreateShift() {
  return (
    <ButtonGroup>
      <Modal>
        {/* Nút đăng ký hàng loạt */}
        <Modal.Open opens="batch-create-shift">
          <Button
            style={{
              background: "var(--color-brand-gradient)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
            }}
          >
            <Sparkles size={16} />
            Đăng ký ca nhanh (Hàng loạt)
          </Button>
        </Modal.Open>
        <Modal.Window name="batch-create-shift">
          <BatchCreateShiftForm />
        </Modal.Window>

        {/* Nút thêm ca đơn lẻ */}
        <Modal.Open opens="create-shift">
          <Button
            variation="secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <Plus size={16} />
            Thêm ca đơn lẻ
          </Button>
        </Modal.Open>
        <Modal.Window name="create-shift">
          <CreateShiftForm />
        </Modal.Window>
      </Modal>
    </ButtonGroup>
  );
}

export default CreateShift;
