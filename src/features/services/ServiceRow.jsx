import styled from "styled-components";
import { useState } from "react";

import CreateServiceForm from "./CreateServiceForm";
import { useDeleteService } from "./useDeleteService";
import { formatCurrency } from "../../utils/helpers";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateService } from "./useCreateService";
import { useDuplicateService } from "./useDuplicateService";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

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
  const [showForm, setShowForm] = useState(false);
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
      <TableRow role="row">
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
          <button onClick={() => setShowForm((show) => !show)}>
            <HiPencil />
          </button>
          <button
            onClick={() => deleteService(serviceId)}
            disabled={isDeleting}
          >
            <HiTrash />
          </button>
        </div>
      </TableRow>
      {showForm && <CreateServiceForm serviceToEdit={service} />}
    </>
  );
}

export default ServiceRow;
