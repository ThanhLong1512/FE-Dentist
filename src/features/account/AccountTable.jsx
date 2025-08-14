import Spinner from "../../components/admin/Spinner";
import AccountRow from "./AccountRow"; // Changed from ShiftRow to AccountRow
import { useAccounts } from "./useAccounts";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

function AccountTable() {
  const { isLoading, accounts } = useAccounts();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!accounts || accounts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#6b7280",
        }}
      >
        No accounts available
      </div>
    );
  }

  let filteredAccounts;

  // 1) FILTER
  const filterValue = searchParams.get("role") || "all";
  if (filterValue === "all") filteredAccounts = accounts;
  if (filterValue === "admin")
    filteredAccounts = accounts.filter((account) => account.role === "admin");
  if (filterValue === "user")
    filteredAccounts = accounts.filter((account) => account.role === "user");

  // Filter by account status
  const statusFilter = searchParams.get("status") || "all";
  if (statusFilter === "locked")
    filteredAccounts = filteredAccounts.filter((account) => account.isLocked);
  if (statusFilter === "active")
    filteredAccounts = filteredAccounts.filter((account) => !account.isLocked);

  // Filter by 2FA requirement
  const twoFAFilter = searchParams.get("twoFA") || "all";
  if (twoFAFilter === "required")
    filteredAccounts = filteredAccounts.filter(
      (account) => account.require_2FA
    );
  if (twoFAFilter === "not-required")
    filteredAccounts = filteredAccounts.filter(
      (account) => !account.require_2FA
    );

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedAccounts = filteredAccounts?.sort((a, b) => {
    if (field === "name" || field === "email" || field === "role") {
      return (
        String(a[field] || "").localeCompare(String(b[field] || "")) * modifier
      );
    } else if (field === "isLocked" || field === "require_2FA") {
      return (Number(a[field]) - Number(b[field])) * modifier;
    } else {
      // For other fields
      return (
        String(a[field] || "").localeCompare(String(b[field] || "")) * modifier
      );
    }
  });

  // 3) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedAccounts = sortedAccounts.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="0.3fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr">
        <Table.Header>
          <div>Photo</div>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>2FA</div>
          <div>Actions</div>
        </Table.Header>
        <Table.Body
          data={paginatedAccounts}
          render={(account) => (
            <AccountRow account={account} key={account._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={filteredAccounts.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default AccountTable;
