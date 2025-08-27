import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const PatientOperations = lazy(() =>
  import("../../features/patient/PatientOperations")
);
const PatientTable = lazy(() => import("../../features/patient/PatientTable"));

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
