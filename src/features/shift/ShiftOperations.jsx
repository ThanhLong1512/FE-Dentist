import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function ShiftOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm kiếm theo tên bác sĩ, chuyên khoa..." searchKey="search" />

      <OperationsGroup>
        <Filter
          filterField="status"
          options={[
            { value: "all", label: "Tất cả ca" },
            { value: "available", label: "Còn trống" },
            { value: "booked", label: "Đã đặt" },
          ]}
        />
        <Filter
          filterField="day"
          options={[
            { value: "all", label: "Cả tuần" },
            { value: "monday", label: "T2" },
            { value: "tuesday", label: "T3" },
            { value: "wednesday", label: "T4" },
            { value: "thursday", label: "T5" },
            { value: "friday", label: "T6" },
            { value: "saturday", label: "T7" },
            { value: "sunday", label: "CN" },
          ]}
        />

        <SortBy
          options={[
            { value: "DayOfWeek-asc", label: "Thứ (T2-CN)" },
            { value: "StartTime-asc", label: "Giờ (sớm trước)" },
            { value: "employeeName-asc", label: "Bác sĩ (A-Z)" },
            { value: "isBooked-asc", label: "Trống trước" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default ShiftOperations;
