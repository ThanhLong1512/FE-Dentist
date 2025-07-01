import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import AppointmentTable from "../../features/appointment/AppointmentTable";
import AppointmentOperations from "../../features/appointment/AppointmentOperations";
function Booking() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Appointment</Heading>
        <AppointmentOperations />
      </Row>
      <Row>
        <AppointmentTable />
      </Row>
    </>
  );
}

export default Booking;
