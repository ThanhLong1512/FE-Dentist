import Spinner from "../../components/admin/Spinner";
import ShiftRow from "./ShiftRow";
import { useShifts } from "./useShifts";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

function ShiftTable() {
  const { isLoading, shifts } = useShifts();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!shifts || shifts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#6b7280",
        }}
      >
        No shifts available
      </div>
    );
  }

  let filteredShifts;

  // 1) FILTER
  const filterValue = searchParams.get("status") || "all";
  if (filterValue === "all") filteredShifts = shifts;
  if (filterValue === "available")
    filteredShifts = shifts.filter((shift) => !shift.isBooked);
  if (filterValue === "booked")
    filteredShifts = shifts.filter((shift) => shift.isBooked);

  // Filter by employee gender if needed
  const genderFilter = searchParams.get("gender") || "all";
  if (genderFilter === "male")
    filteredShifts = filteredShifts.filter(
      (shift) => shift.employee && shift.employee.gender === false
    );
  if (genderFilter === "female")
    filteredShifts = filteredShifts.filter(
      (shift) => shift.employee && shift.employee.gender === true
    );

  // Filter by day of week
  const dayFilter = searchParams.get("day") || "all";
  if (dayFilter !== "all") {
    filteredShifts = filteredShifts.filter(
      (shift) => shift.DayOfWeek.toLowerCase() === dayFilter.toLowerCase()
    );
  }

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "DayOfWeek-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedShifts = filteredShifts?.sort((a, b) => {
    if (field === "employeeName") {
      const nameA = a.employee?.name || "";
      const nameB = b.employee?.name || "";
      return nameA.localeCompare(nameB) * modifier;
    } else if (field === "StartTime" || field === "EndTime") {
      // Convert time string to minutes for comparison
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };
      return (timeToMinutes(a[field]) - timeToMinutes(b[field])) * modifier;
    } else if (field === "DayOfWeek") {
      // Sort by day of week order
      const dayOrder = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      };
      return ((dayOrder[a[field]] || 0) - (dayOrder[b[field]] || 0)) * modifier;
    } else if (field === "isBooked") {
      return (Number(a[field]) - Number(b[field])) * modifier;
    } else {
      // For other string fields
      return (
        String(a[field] || "").localeCompare(String(b[field] || "")) * modifier
      );
    }
  });

  // 3) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedShifts = sortedShifts.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="1fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr 1fr">
        <Table.Header>
          <div>Employee</div>
          <div>Service</div>
          <div>Day</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Status</div>
          <div>Actions</div>
        </Table.Header>
        <Table.Body
          data={paginatedShifts}
          render={(shift) => <ShiftRow shift={shift} key={shift._id} />}
        />
        <Table.Footer>
          <Pagination count={filteredShifts.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default ShiftTable;
