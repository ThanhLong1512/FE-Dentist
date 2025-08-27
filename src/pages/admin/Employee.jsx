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
      <Row type="horizontal">
        <Heading as="h1">Employee</Heading>
        <EmployeeOperations />
      </Row>
      <Row>
        <EmployeeTable />
        <CreateEmployee />
      </Row>
    </>
  );
}

export default Employee;
