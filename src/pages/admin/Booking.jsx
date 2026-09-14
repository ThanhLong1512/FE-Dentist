import { lazy, Suspense } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const AppointmentTable = lazy(() =>
  import("../../features/appointment/AppointmentTable")
);
const AppointmentOperations = lazy(() =>
  import("../../features/appointment/AppointmentOperations")
);
const Spinner = lazy(() => import("../../components/admin/Spinner"));

function Booking() {
  return (
    <Suspense fallback={<Spinner />}>
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
        <Heading as="h1">Lịch hẹn khám (Appointments)</Heading>
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <AppointmentOperations />
        <AppointmentTable />
      </Row>
    </Suspense>
  );
}

export default Booking;
