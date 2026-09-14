import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function PatientOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm theo tên, sđt, địa chỉ..." searchKey="q" />

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
            { value: "yearOfBirth-asc", label: "Năm sinh (tăng dần)" },
            { value: "yearOfBirth-desc", label: "Năm sinh (giảm dần)" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default PatientOperations;
