import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations from "../../components/admin/TableOperations";

function EmployeeOperations() {
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
          { value: "email-asc", label: "Sort by email (A-Z)" },
          { value: "email-desc", label: "Sort by email (Z-A)" },
          { value: "phoneNumber-asc", label: "Sort by phone (A-Z)" },
          { value: "phoneNumber-desc", label: "Sort by phone (Z-A)" },
        ]}
      />
    </TableOperations>
  );
}

export default EmployeeOperations;
