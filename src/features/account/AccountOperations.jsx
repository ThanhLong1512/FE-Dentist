import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations, { OperationsGroup } from "../../components/admin/TableOperations";
import SearchBar from "../../components/admin/SearchBar";

function AccountOperations() {
  return (
    <TableOperations>
      <SearchBar placeholder="Tìm kiếm theo tên, email, vai trò..." />

      <OperationsGroup>
        <Filter
          filterField="role"
          options={[
            { value: "all", label: "Tất cả vai trò" },
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
          ]}
        />

        <Filter
          filterField="status"
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "active", label: "Hoạt động" },
            { value: "locked", label: "Đã khóa" },
          ]}
        />

        <Filter
          filterField="twoFA"
          options={[
            { value: "all", label: "Tất cả 2FA" },
            { value: "required", label: "Bật 2FA" },
            { value: "not-required", label: "Tắt 2FA" },
          ]}
        />

        <SortBy
          options={[
            { value: "name-asc", label: "Tên (A-Z)" },
            { value: "name-desc", label: "Tên (Z-A)" },
            { value: "email-asc", label: "Email (A-Z)" },
            { value: "email-desc", label: "Email (Z-A)" },
            { value: "role-asc", label: "Vai trò (A-Z)" },
            { value: "isLocked-asc", label: "Hoạt động trước" },
            { value: "isLocked-desc", label: "Đã khóa trước" },
          ]}
        />
      </OperationsGroup>
    </TableOperations>
  );
}

export default AccountOperations;
