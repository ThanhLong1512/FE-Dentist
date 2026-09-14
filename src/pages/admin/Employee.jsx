import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const EmployeeTable = lazy(() =>
  import("../../features/employee/EmployeeTable")
);
const CreateEmployee = lazy(() =>
  import("../../features/employee/CreateEmployee")
);
const EmployeeOperations = lazy(() =>
  import("../../features/employee/EmployeeOperations")
);

function Employee() {
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
        <Heading as="h1">Nhân sự & Bác sĩ (Employees)</Heading>
        <CreateEmployee />
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <EmployeeOperations />
        <EmployeeTable />
      </Row>
    </>
  );
}

export default Employee;
