import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function AppointmentOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm theo bệnh nhân, bác sĩ, dịch vụ..." searchKey="q" />

      <OperationsGroup>
        <Filter
          filterField="gender"
          options={[
            { value: "all", label: "Tất cả giới tính" },
            { value: "male", label: "Bệnh nhân Nam" },
            { value: "female", label: "Bệnh nhân Nữ" },
          ]}
        />
        <SortBy
          options={[
            { value: "Date-desc", label: "Ngày hẹn (mới nhất)" },
            { value: "Date-asc", label: "Ngày hẹn (cũ nhất)" },
            { value: "patientName-asc", label: "Tên bệnh nhân (A-Z)" },
            { value: "doctorName-asc", label: "Tên bác sĩ (A-Z)" },
            { value: "service-asc", label: "Dịch vụ (A-Z)" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default AppointmentOperations;
