import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import CreatePatient from "../../features/patient/CreatePatient";
import PatientOperations from "../../features/patient/PatientOperations";
import PatientTable from "../../features/patient/PatientTable";

function Patient() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Patient</Heading>
        <PatientOperations />
      </Row>
      <Row>
        <PatientTable />
      </Row>
    </>
  );
}

export default Patient;
