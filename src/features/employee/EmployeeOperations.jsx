import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function EmployeeOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm kiếm theo tên, email, sđt..." searchKey="search" />

      <OperationsGroup>
        <Filter
          filterField="gender"
          options={[
            { value: "all", label: "Tất cả giới tính" },
            { value: "male", label: "Nam" },
            { value: "female", label: "Nữ" },
          ]}
        />

        <SortBy
          options={[
            { value: "name-asc", label: "Tên (A-Z)" },
            { value: "name-desc", label: "Tên (Z-A)" },
            { value: "email-asc", label: "Email (A-Z)" },
            { value: "phoneNumber-asc", label: "SĐT (tăng dần)" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default EmployeeOperations;
