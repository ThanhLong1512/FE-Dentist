import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations from "../../components/admin/TableOperations";

function ShiftOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All Shifts" },
          { value: "available", label: "Available" },
          { value: "booked", label: "Booked" },
        ]}
      />
      <Filter
        filterField="day"
        options={[
          { value: "all", label: "All Days" },
          { value: "monday", label: "Monday" },
          { value: "tuesday", label: "Tuesday" },
          { value: "wednesday", label: "Wednesday" },
          { value: "thursday", label: "Thursday" },
          { value: "friday", label: "Friday" },
          { value: "saturday", label: "Saturday" },
          { value: "sunday", label: "Sunday" },
        ]}
      />

      {/* Sort options */}
      <SortBy
        options={[
          { value: "DayOfWeek-asc", label: "Sort by day (Mon-Sun)" },
          { value: "DayOfWeek-desc", label: "Sort by day (Sun-Mon)" },
          { value: "StartTime-asc", label: "Sort by start time (early first)" },
          { value: "StartTime-desc", label: "Sort by start time (late first)" },
          { value: "employeeName-asc", label: "Sort by employee (A-Z)" },
          { value: "employeeName-desc", label: "Sort by employee (Z-A)" },
          { value: "isBooked-asc", label: "Available first" },
          { value: "isBooked-desc", label: "Booked first" },
        ]}
      />
    </TableOperations>
  );
}

export default ShiftOperations;
