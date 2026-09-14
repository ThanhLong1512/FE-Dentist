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
      <Row
        type="horizontal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.2rem",
          marginBottom: "0.8rem",
        }}
      >
        <Heading as="h1">Quản lý Tài khoản (Users)</Heading>
        <CreateAccount />
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <AccountOperations />
        <AccountTable />
      </Row>
    </>
  );
}

export default User;
