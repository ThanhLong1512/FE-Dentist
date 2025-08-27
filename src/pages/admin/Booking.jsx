import { lazy, Suspense } from "react";
s;
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
      <Row type="horizontal">
        <Heading as="h1">Appointment</Heading>
        <AppointmentOperations />
      </Row>
      <Row>
        <AppointmentTable />
      </Row>
    </Suspense>
  );
}

export default Booking;
