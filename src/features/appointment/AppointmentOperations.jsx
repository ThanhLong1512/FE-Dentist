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
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "yearOfBirth-asc", label: "Sort by year (low first)" },
          { value: "yearOfBirth-desc", label: "Sort by year (high first)" },
        ]}
      />
    </TableOperations>
  );
}

export default AppointmentOperations;
