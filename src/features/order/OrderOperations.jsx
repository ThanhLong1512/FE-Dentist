import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function OrderOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm kiếm theo mã đơn, khách hàng..." searchKey="search" />

      <OperationsGroup>
        <Filter
          filterField="status"
          options={[
            { value: "all", label: "Tất cả đơn" },
            { value: "successful", label: "Thành công" },
            { value: "processing", label: "Đang xử lý" },
            { value: "cancelled", label: "Đã hủy" },
          ]}
        />
        <SortBy
          options={[
            { value: "createAt-desc", label: "Ngày đặt (mới nhất)" },
            { value: "createAt-asc", label: "Ngày đặt (cũ nhất)" },
            { value: "customerName-asc", label: "Tên khách hàng (A-Z)" },
            { value: "totalPrice-desc", label: "Tổng tiền (cao trước)" },
            { value: "totalPrice-asc", label: "Tổng tiền (thấp trước)" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default OrderOperations;
