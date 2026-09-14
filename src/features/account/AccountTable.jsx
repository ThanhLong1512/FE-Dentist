import styled from "styled-components";
import { UserX, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import AccountRow from "./AccountRow";
import { useAccounts } from "./useAccounts";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  gap: 1.2rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  text-align: center;

  svg {
    width: 4.8rem;
    height: 4.8rem;
    color: var(--color-grey-300);
  }

  h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-700);
    margin: 0;
  }

  p {
    font-size: 1.3rem;
    color: var(--color-grey-400);
    margin: 0;
    max-width: 32rem;
  }
`;

function AccountTable() {
  const { isLoading, accounts } = useAccounts();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const allAccounts = accounts || [];

  if (allAccounts.length === 0) {
    return (
      <EmptyStateContainer>
        <UserX />
        <h3>Chưa có tài khoản nào</h3>
        <p>Hệ thống chưa ghi nhận tài khoản người dùng hoặc dữ liệu đang trống.</p>
      </EmptyStateContainer>
    );
  }

  // 1) ROLE FILTER
  let filteredAccounts = allAccounts;
  const filterValue = searchParams.get("role") || "all";
  if (filterValue === "admin")
    filteredAccounts = filteredAccounts.filter((account) => account.role === "admin");
  if (filterValue === "user")
    filteredAccounts = filteredAccounts.filter((account) => account.role === "user");

  // 2) STATUS FILTER
  const statusFilter = searchParams.get("status") || "all";
  if (statusFilter === "locked")
    filteredAccounts = filteredAccounts.filter((account) => account.isLocked);
  if (statusFilter === "active")
    filteredAccounts = filteredAccounts.filter((account) => !account.isLocked);

  // 3) 2FA FILTER
  const twoFAFilter = searchParams.get("twoFA") || "all";
  if (twoFAFilter === "required")
    filteredAccounts = filteredAccounts.filter((account) => account.require_2FA);
  if (twoFAFilter === "not-required")
    filteredAccounts = filteredAccounts.filter((account) => !account.require_2FA);

  // 4) SEARCH FILTER
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  if (searchQuery) {
    filteredAccounts = filteredAccounts.filter((account) => {
      const name = (account.name || "").toLowerCase();
      const email = (account.email || "").toLowerCase();
      const role = (account.role || "").toLowerCase();
      const phone = (account.phone || "").toLowerCase();
      return (
        name.includes(searchQuery) ||
        email.includes(searchQuery) ||
        role.includes(searchQuery) ||
        phone.includes(searchQuery)
      );
    });
  }

  // If search/filter returned no results
  if (filteredAccounts.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy tài khoản phù hợp</h3>
        <p>Không có tài khoản nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
      </EmptyStateContainer>
    );
  }

  // 5) SORT
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (field === "name" || field === "email" || field === "role") {
      return (
        String(a[field] || "").localeCompare(String(b[field] || "")) * modifier
      );
    } else if (field === "isLocked" || field === "require_2FA") {
      return (Number(a[field]) - Number(b[field])) * modifier;
    } else {
      return (
        String(a[field] || "").localeCompare(String(b[field] || "")) * modifier
      );
    }
  });

  // 6) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedAccounts = sortedAccounts.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="0.4fr 1.3fr 1.4fr 0.9fr 0.9fr 0.8fr 0.6fr">
        <Table.Header>
          <div>Ảnh</div>
          <div>Họ và tên</div>
          <div>Email</div>
          <div>Vai trò</div>
          <div>Trạng thái</div>
          <div>2FA</div>
          <div>Thao tác</div>
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
