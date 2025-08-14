import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import AccountOperations from "../../features/account/AccountOperations";
import AccountTable from "../../features/account/AccountTable";
import CreateAccount from "../../features/account/CreateAccount";
function User() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Users</Heading>
        <AccountOperations />
      </Row>
      <Row>
        <AccountTable />
        <CreateAccount />
      </Row>
    </>
  );
}

export default User;
