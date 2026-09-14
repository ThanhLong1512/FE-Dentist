import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const PatientOperations = lazy(() =>
  import("../../features/patient/PatientOperations")
);
const PatientTable = lazy(() => import("../../features/patient/PatientTable"));
const CreatePatient = lazy(() =>
  import("../../features/patient/CreatePatient")
);

function Patient() {
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
        <Heading as="h1">Quản lý Bệnh nhân (Patients)</Heading>
        <CreatePatient />
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <PatientOperations />
        <PatientTable />
      </Row>
    </>
  );
}

export default Patient;
