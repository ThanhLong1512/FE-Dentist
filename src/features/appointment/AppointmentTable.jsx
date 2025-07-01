import Spinner from "../../components/admin/Spinner";
import AppointmentRow from "./AppointmentRow";
import { useAppointments } from "./useAppointments";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

function AppointmentTable() {
  const { isLoading, appointments } = useAppointments();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  let filteredAppointments;

  // Filter by patient gender
  const filterValue = searchParams.get("gender") || "all";
  if (filterValue === "all") filteredAppointments = appointments;
  if (filterValue === "male")
    filteredAppointments = appointments.filter(
      (appointment) => appointment.patient.gender === true
    );
  if (filterValue === "female")
    filteredAppointments = appointments.filter(
      (appointment) => appointment.patient.gender === false
    );

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "Date-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedAppointments = filteredAppointments?.sort((a, b) => {
    if (field === "patientName") {
      return a.patient.name.localeCompare(b.patient.name) * modifier;
    } else if (field === "doctorName") {
      return (
        a.shift.employee.name.localeCompare(b.shift.employee.name) * modifier
      );
    } else if (field === "Date") {
      return (new Date(a.Date) - new Date(b.Date)) * modifier;
    } else if (field === "service") {
      return (
        a.shift.employee.service.nameService.localeCompare(
          b.shift.employee.service.nameService
        ) * modifier
      );
    } else {
      return (a[field] - b[field]) * modifier;
    }
  });

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedAppointments = sortedAppointments.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Service</div>
          <div>Date</div>
          <div>Time</div>
          <div>Price</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={paginatedAppointments}
          render={(appointment) => (
            <AppointmentRow appointment={appointment} key={appointment._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={sortedAppointments?.length || 0} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default AppointmentTable;
