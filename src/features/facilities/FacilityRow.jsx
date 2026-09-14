import styled from "styled-components";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { MapPin, Phone, Clock, Armchair } from "lucide-react";

import CreateFacilityForm from "./CreateFacilityForm";
import { useDeleteFacility } from "./useDeleteFacility";
import Modal from "../../components/admin/Modal";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";

const ImgContainer = styled.div`
  width: 5.6rem;
  height: 4.2rem;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  background-color: var(--color-grey-100);
  border: 1px solid var(--color-grey-200);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const FacilityCode = styled.span`
  display: inline-block;
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  border-radius: var(--border-radius-sm);
  width: fit-content;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .name {
    font-size: 1.45rem;
    font-weight: 600;
    color: var(--color-grey-700);
  }

  .manager {
    font-size: 1.2rem;
    color: var(--color-grey-400);
  }
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .city-badge {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-indigo-700);
    background-color: var(--color-indigo-100);
    padding: 0.2rem 0.6rem;
    border-radius: var(--border-radius-sm);
    width: fit-content;
  }

  .address-text {
    font-size: 1.25rem;
    color: var(--color-grey-500);
    line-height: 1.3;
  }
`;

const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 1.25rem;

  .phone {
    font-weight: 600;
    color: var(--color-blue-700);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .hours {
    color: var(--color-grey-400);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.15rem;
  }
`;

const ChairBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const StatusBadge = styled.span`
  display: inline-block;
  font-size: 1.15rem;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius-sm);
  text-transform: capitalize;
  width: fit-content;

  ${(props) =>
    props.status === "active" &&
    `
      color: var(--color-green-700);
      background-color: var(--color-green-100);
    `}

  ${(props) =>
    props.status === "maintenance" &&
    `
      color: var(--color-yellow-700);
      background-color: var(--color-yellow-100);
    `}

  ${(props) =>
    props.status === "inactive" &&
    `
      color: var(--color-red-700);
      background-color: var(--color-red-100);
    `}
`;

function FacilityRow({ facility }) {
  const { isDeleting, deleteFacility } = useDeleteFacility();

  const {
    _id: facilityId,
    name,
    code,
    address,
    city,
    phoneNumber,
    workingHours,
    chairCount,
    managerName,
    status,
    image,
  } = facility;

  const statusLabel =
    status === "active"
      ? "Hoạt động"
      : status === "maintenance"
      ? "Bảo trì"
      : "Tạm ngưng";

  return (
    <Table.Row>
      <ImgContainer>
        <img
          src={image || "/images/resource/image-1.png"}
          alt={name}
          onError={(e) => {
            e.target.src = "/images/resource/image-1.png";
          }}
        />
      </ImgContainer>

      <FacilityCode>{code}</FacilityCode>

      <NameContainer>
        <span className="name">{name}</span>
        {managerName && <span className="manager">QL: {managerName}</span>}
      </NameContainer>

      <AddressContainer>
        <span className="city-badge">{city}</span>
        <span className="address-text">{address}</span>
      </AddressContainer>

      <ContactContainer>
        <span className="phone">
          <Phone size={13} />
          {phoneNumber}
        </span>
        {workingHours && (
          <span className="hours">
            <Clock size={12} />
            {workingHours}
          </span>
        )}
      </ContactContainer>

      <ChairBadge>
        <Armchair size={15} color="var(--color-brand-600)" />
        {chairCount || 1} ghế
      </ChairBadge>

      <StatusBadge status={status}>{statusLabel}</StatusBadge>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={facilityId} />

            <Menus.List id={facilityId}>
              <Modal.Open opens="edit-facility">
                <Menus.Button icon={<HiPencil />}>Sửa thông tin</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete-facility">
                <Menus.Button icon={<HiTrash />}>Xóa cơ sở</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit-facility">
              <CreateFacilityForm facilityToEdit={facility} />
            </Modal.Window>

            <Modal.Window name="delete-facility">
              <ConfirmDelete
                resourceName={`cơ sở "${name}"`}
                disabled={isDeleting}
                onConfirm={() => deleteFacility(facilityId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default FacilityRow;
