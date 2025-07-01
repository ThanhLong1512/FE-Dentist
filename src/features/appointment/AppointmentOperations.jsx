import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations from "../../components/admin/TableOperations";

function AppointmentOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="gender"
        options={[
          { value: "all", label: "All" },
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
      />
      <SortBy
        options={[
          { value: "Date-desc", label: "Sort by date (newest first)" },
          { value: "Date-asc", label: "Sort by date (oldest first)" },
          { value: "patientName-asc", label: "Sort by patient name (A-Z)" },
          { value: "patientName-desc", label: "Sort by patient name (Z-A)" },
          { value: "doctorName-asc", label: "Sort by doctor name (A-Z)" },
          { value: "doctorName-desc", label: "Sort by doctor name (Z-A)" },
          { value: "service-asc", label: "Sort by service (A-Z)" },
          { value: "service-desc", label: "Sort by service (Z-A)" },
        ]}
      />
    </TableOperations>
  );
}

export default AppointmentOperations;
