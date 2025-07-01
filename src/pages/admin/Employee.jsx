import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";

function Employee() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Employee</Heading>
        <p>TEST</p>
      </Row>
      <Row>
        <PatientTable />
      </Row>
    </>
  );
}

export default Employee;
