import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--color-grey-200);
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.35);
  padding: 3.2rem 3.6rem;
  max-height: 88vh;
  overflow-y: auto;
  max-width: 95vw;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1001;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 4px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1000;
  transition: all 0.3s;
`;

const CloseButton = styled.button`
  background: var(--color-grey-100);
  border: 1px solid var(--color-grey-200);
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 1.6rem;
  right: 1.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-grey-500);
  z-index: 50;

  &:hover {
    background-color: var(--color-red-100);
    color: var(--color-red-700);
    border-color: var(--color-red-100);
    transform: scale(1.06);
  }

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => {
    setOpenName("");
  };
  const open = setOpenName;
  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ opens: openWindowName, children }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(openWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);
  if (name !== openName) return null;
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <CloseButton onClick={close} title="Đóng cửa sổ">
          <HiXMark />
        </CloseButton>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
