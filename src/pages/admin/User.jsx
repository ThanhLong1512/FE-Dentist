import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const AccountOperations = lazy(() =>
  import("../../features/account/AccountOperations")
);
const AccountTable = lazy(() => import("../../features/account/AccountTable"));
const CreateAccount = lazy(() =>
  import("../../features/account/CreateAccount")
);

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
