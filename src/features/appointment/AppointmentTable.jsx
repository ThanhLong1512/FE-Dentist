import Spinner from "../../components/admin/Spinner";
import AppointmentRow from "./AppointmentRow";
import { useAppointments } from "./useAppointments";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";
import styled from "styled-components";

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: inherit;
`;

function AppointmentTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { isLoading, error, appointments } = useAppointments({ q });

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-red-700)" }}>
        {error?.message || "Không thể tải danh sách lịch hẹn"}
      </div>
    );

  let filteredAppointments;

  // Filter by patient gender
  const filterValue = q && q.trim() ? "all" : searchParams.get("gender") || "all";
  const safeAppointments = appointments || [];
  if (filterValue === "all") filteredAppointments = safeAppointments;
  else if (filterValue === "male")
    filteredAppointments = safeAppointments.filter(
      (apt) => apt.patient?.gender === true
    );
  else if (filterValue === "female")
    filteredAppointments = safeAppointments.filter(
      (apt) => apt.patient?.gender === false
    );
  else filteredAppointments = safeAppointments;

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "Date-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedAppointments = [...(filteredAppointments || [])].sort((a, b) => {
    if (field === "patientName") {
      return ((a.patient?.name || "").localeCompare(b.patient?.name || "")) * modifier;
    } else if (field === "doctorName") {
      return (
        ((a.shift?.employee?.name || "").localeCompare(b.shift?.employee?.name || "")) * modifier
      );
    } else if (field === "Date") {
      return (new Date(a.Date || 0) - new Date(b.Date || 0)) * modifier;
    } else if (field === "service") {
      return (
        ((a.shift?.employee?.service?.nameService || "").localeCompare(
          b.shift?.employee?.service?.nameService || ""
        )) * modifier
      );
    } else {
      return ((a[field] || 0) - (b[field] || 0)) * modifier;
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
      <div style={{ marginBottom: 12 }}>
        <SearchInput
          placeholder="Tìm theo bệnh nhân / ghi chú / bác sĩ..."
          value={q}
          onChange={(e) => {
            const next = e.target.value;
            if (!next) searchParams.delete("q");
            else searchParams.set("q", next);
            searchParams.set("page", "1");
            setSearchParams(searchParams);
          }}
        />
      </div>
      <Table columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Service</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
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
