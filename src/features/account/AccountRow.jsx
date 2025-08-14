import styled from "styled-components";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { HiPencil } from "react-icons/hi2";
import Modal from "../../components/admin/Modal";
import CreateAccountForm from "./CreateAccountForm";

const Photo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-grey-200);
  }
`;

const Name = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Email = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
`;

const Role = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-700);
  text-transform: capitalize;
`;

const Status = styled.span`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: var(--border-radius-sm);

  /* Make these dynamic, based on the received prop */
  color: ${(props) =>
    props.type === "active"
      ? "var(--color-green-700)"
      : "var(--color-red-700)"};
  background-color: ${(props) =>
    props.type === "active"
      ? "var(--color-green-100)"
      : "var(--color-red-100)"};
`;

const TwoFA = styled.span`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: var(--border-radius-sm);

  /* Make these dynamic, based on the received prop */
  color: ${(props) =>
    props.enabled === "true"
      ? "var(--color-blue-700)"
      : "var(--color-grey-700)"};
  background-color: ${(props) =>
    props.enabled === "true"
      ? "var(--color-blue-100)"
      : "var(--color-grey-100)"};
`;

function AccountRow({ account }) {
  const {
    _id: accountId,
    name,
    email,
    role,
    photo,
    isLocked,
    require_2FA,
  } = account;

  const status = isLocked ? "locked" : "active";
  const twoFAStatus = require_2FA ? "enabled" : "disabled";

  return (
    <Table.Row>
      <Photo>
        <img
          src={photo || "/default-user.jpg"}
          alt={`${name}'s profile`}
          onError={(e) => {
            e.target.src = "/default-user.jpg";
          }}
        />
      </Photo>
      <Name>{name}</Name>
      <Email>{email}</Email>
      <Role>{role}</Role>
      <Status type={status}>{status}</Status>
      <TwoFA enabled={require_2FA.toString()}>{twoFAStatus}</TwoFA>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={accountId} />

            <Menus.List id={accountId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateAccountForm accountToEdit={account} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default AccountRow;
