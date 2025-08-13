import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import EmployeeTable from "../../features/employee/EmployeeTable";
import CreateEmployee from "../../features/employee/CreateEmployee";
import EmployeeOperations from "../../features/employee/EmployeeOperations";

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
