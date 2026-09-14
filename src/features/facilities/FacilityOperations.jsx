import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function FacilityOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm kiếm theo tên cơ sở, mã, địa chỉ, hotline..." searchKey="search" />

      <OperationsGroup>
        <Filter
          filterField="status"
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "active", label: "Đang hoạt động" },
            { value: "maintenance", label: "Đang bảo trì" },
            { value: "inactive", label: "Tạm ngưng" },
          ]}
        />

        <Filter
          filterField="city"
          options={[
            { value: "all", label: "Tất cả khu vực" },
            { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
            { value: "Hà Nội", label: "Hà Nội" },
          ]}
        />

        <SortBy
          options={[
            { value: "name-asc", label: "Tên cơ sở (A-Z)" },
            { value: "name-desc", label: "Tên cơ sở (Z-A)" },
            { value: "chairCount-desc", label: "Số ghế (nhiều nhất)" },
            { value: "chairCount-asc", label: "Số ghế (ít nhất)" },
            { value: "createdAt-desc", label: "Mới nhất" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default FacilityOperations;
