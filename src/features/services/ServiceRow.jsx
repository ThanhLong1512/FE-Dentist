import styled from "styled-components";
import { useState } from "react";

import CreateServiceForm from "./CreateServiceForm";
import { useDeleteService } from "./useDeleteService";
import { formatCurrency } from "../../utils/helpers";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateService } from "./useCreateService";
import { useDuplicateService } from "./useDuplicateService";
import Modal from "../../components/admin/Modal";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import Table from "../../components/admin/Table";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function ServiceRow({ service }) {
  const { isDeleting, deleteService } = useDeleteService();
  const { isDuplicating, duplicateService } = useDuplicateService();

  const {
    id: serviceId,
    nameService,
    Unit,
    priceService,
    priceDiscount,
    photoService,
  } = service;

  function handleDuplicate() {
    duplicateService(serviceId);
  }

  return (
    <>
      <Table.Row>
        <Img src={photoService.url} />
        <Cabin>{nameService}</Cabin>
        <div>{Unit}</div>
        <Price>{formatCurrency(priceService)}</Price>
        {priceDiscount ? (
          <Discount>{formatCurrency(priceDiscount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <div>
          <button disabled={isDuplicating} onClick={handleDuplicate}>
            <HiSquare2Stack />
          </button>
          <Modal>
            <Modal.Open opens="edit-service">
              <button>
                <HiPencil />
              </button>
            </Modal.Open>
            <Modal.Window name="edit-service">
              <CreateServiceForm serviceToEdit={service} />
            </Modal.Window>
            <Modal.Open opens="delete-service">
              <button disabled={isDeleting}>
                <HiTrash />
              </button>
            </Modal.Open>
            <Modal.Window name="delete-service">
              <ConfirmDelete
                resource="services"
                onConfirm={() => deleteService(serviceId)}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default ServiceRow;
