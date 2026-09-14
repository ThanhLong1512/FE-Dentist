import styled from "styled-components";
import { CalendarX, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import AppointmentRow from "./AppointmentRow";
import { useAppointments } from "./useAppointments";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  gap: 1.2rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  text-align: center;

  svg {
    width: 4.8rem;
    height: 4.8rem;
    color: var(--color-grey-300);
  }

  h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-700);
    margin: 0;
  }

  p {
    font-size: 1.3rem;
    color: var(--color-grey-400);
    margin: 0;
    max-width: 32rem;
  }
`;

function AppointmentTable() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { isLoading, error, appointments = [] } = useAppointments({ q });

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-red-700)" }}>
        {error?.message || "Không thể tải danh sách lịch hẹn"}
      </div>
    );

  const safeAppointments = appointments || [];

  if (safeAppointments.length === 0) {
    return (
      <EmptyStateContainer>
        <CalendarX />
        <h3>Chưa có lịch hẹn nào</h3>
        <p>Hệ thống chưa ghi nhận lịch hẹn khám nào từ bệnh nhân.</p>
      </EmptyStateContainer>
    );
  }

  let filteredAppointments;

  // Filter by patient gender
  const filterValue = q && q.trim() ? "all" : searchParams.get("gender") || "all";
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

  if (filteredAppointments.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy lịch hẹn phù hợp</h3>
        <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
      </EmptyStateContainer>
    );
  }

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "Date-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (field === "patientName") {
      return ((a.patient?.name || "").localeCompare(b.patient?.name || "")) * modifier;
    } else if (field === "doctorName") {
      return (
        ((a.shift?.employee?.name || "").localeCompare(b.shift?.employee?.name || "")) * modifier
      );
    } else if (field === "service") {
      return (
        ((a.service?.nameService || "").localeCompare(b.service?.nameService || "")) * modifier
      );
    } else if (field === "Date") {
      const dateA = new Date(a.date || a.Date || 0).getTime();
      const dateB = new Date(b.date || b.Date || 0).getTime();
      return (dateA - dateB) * modifier;
    }
    return 0;
  });

  // 3) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedAppointments = sortedAppointments.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="1.2fr 1.2fr 1.4fr 1fr 0.9fr 1fr 1fr 0.6fr">
        <Table.Header>
          <div>Bệnh nhân</div>
          <div>Bác sĩ</div>
          <div>Dịch vụ</div>
          <div>Ngày khám</div>
          <div>Giờ khám</div>
          <div>Trạng thái</div>
          <div>Chi phí</div>
          <div>Thao tác</div>
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
