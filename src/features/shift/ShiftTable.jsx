import styled from "styled-components";
import { CalendarX, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import ShiftRow from "./ShiftRow";
import { useShifts } from "./useShifts";
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

function ShiftTable() {
  const { isLoading, shifts = [] } = useShifts();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const allShifts = shifts || [];

  if (allShifts.length === 0) {
    return (
      <EmptyStateContainer>
        <CalendarX />
        <h3>Chưa có ca trực nào</h3>
        <p>Hệ thống chưa có dữ liệu ca trực của bác sĩ.</p>
      </EmptyStateContainer>
    );
  }

  // 1) FILTER
  let filteredShifts = allShifts;
  const filterValue = searchParams.get("status") || "all";
  if (filterValue === "available")
    filteredShifts = filteredShifts.filter((shift) => !shift.isBooked);
  if (filterValue === "booked")
    filteredShifts = filteredShifts.filter((shift) => shift.isBooked);

  // Filter by day of week
  const dayFilter = searchParams.get("day") || "all";
  if (dayFilter !== "all") {
    filteredShifts = filteredShifts.filter(
      (shift) => shift.DayOfWeek && shift.DayOfWeek.toLowerCase() === dayFilter.toLowerCase()
    );
  }

  // 2) SEARCH FILTER
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  if (searchQuery) {
    filteredShifts = filteredShifts.filter((shift) => {
      const docName = (shift.employee?.name || "").toLowerCase();
      const serviceName = (shift.employee?.service?.nameService || "").toLowerCase();
      const day = (shift.DayOfWeek || "").toLowerCase();
      return docName.includes(searchQuery) || serviceName.includes(searchQuery) || day.includes(searchQuery);
    });
  }

  if (filteredShifts.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy ca trực phù hợp</h3>
        <p>Thử thay đổi bộ lọc thứ trong tuần hoặc từ khóa tìm kiếm.</p>
      </EmptyStateContainer>
    );
  }

  // 3) SORT
  const sortBy = searchParams.get("sortBy") || "DayOfWeek-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const dayOrder = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  const sortedShifts = [...filteredShifts].sort((a, b) => {
    if (field === "DayOfWeek") {
      const dayA = dayOrder[a.DayOfWeek?.toLowerCase()] || 0;
      const dayB = dayOrder[b.DayOfWeek?.toLowerCase()] || 0;
      return (dayA - dayB) * modifier;
    } else if (field === "employeeName") {
      const nameA = a.employee?.name || "";
      const nameB = b.employee?.name || "";
      return nameA.localeCompare(nameB) * modifier;
    } else if (field === "StartTime") {
      return (a.StartTime || "").localeCompare(b.StartTime || "") * modifier;
    } else if (field === "isBooked") {
      return (Number(a.isBooked) - Number(b.isBooked)) * modifier;
    }
    return 0;
  });

  // 4) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedShifts = sortedShifts.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="1.8fr 1.2fr 1.2fr 1.2fr 1fr 0.6fr">
        <Table.Header>
          <div>Bác sĩ</div>
          <div>Thứ trong tuần</div>
          <div>Giờ bắt đầu</div>
          <div>Giờ kết thúc</div>
          <div>Trạng thái</div>
          <div>Thao tác</div>
        </Table.Header>
        <Table.Body
          data={paginatedShifts}
          render={(shift) => (
            <ShiftRow shift={shift} key={shift._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={filteredShifts.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default ShiftTable;
