import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations from "../../components/admin/TableOperations";

function AccountOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="role"
        options={[
          { value: "all", label: "All Roles" },
          { value: "admin", label: "Admin" },
          { value: "user", label: "User" },
        ]}
      />

      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All Status" },
          { value: "active", label: "Active" },
          { value: "locked", label: "Locked" },
        ]}
      />

      <Filter
        filterField="twoFA"
        options={[
          { value: "all", label: "All 2FA" },
          { value: "required", label: "2FA Required" },
          { value: "not-required", label: "2FA Not Required" },
        ]}
      />

      {/* Sort options */}
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "email-asc", label: "Sort by email (A-Z)" },
          { value: "email-desc", label: "Sort by email (Z-A)" },
          { value: "role-asc", label: "Sort by role (A-Z)" },
          { value: "role-desc", label: "Sort by role (Z-A)" },
          { value: "isLocked-asc", label: "Active first" },
          { value: "isLocked-desc", label: "Locked first" },
          { value: "require_2FA-asc", label: "No 2FA first" },
          { value: "require_2FA-desc", label: "2FA required first" },
        ]}
      />
    </TableOperations>
  );
}

export default AccountOperations;
