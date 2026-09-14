import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function ServiceOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm kiếm tên dịch vụ, đơn vị tính..." searchKey="search" />

      <OperationsGroup>
        <Filter
          filterField="discount"
          options={[
            { value: "all", label: "Tất cả dịch vụ" },
            { value: "no-discount", label: "Giá gốc" },
            { value: "with-discount", label: "Đang ưu đãi" },
          ]}
        />

        <SortBy
          options={[
            { value: "nameService-asc", label: "Tên (A-Z)" },
            { value: "nameService-desc", label: "Tên (Z-A)" },
            { value: "priceService-asc", label: "Giá (thấp đến cao)" },
            { value: "priceService-desc", label: "Giá (cao đến thấp)" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default ServiceOperations;
