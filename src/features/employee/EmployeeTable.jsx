import styled from "styled-components";
import { UserCheck, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import EmployeeRow from "./EmployeeRow";
import { useEmployees } from "./useEmployees";
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

function EmployeeTable() {
  const { isLoading, employees = [] } = useEmployees();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const allEmployees = employees || [];

  if (allEmployees.length === 0) {
    return (
      <EmptyStateContainer>
        <UserCheck />
        <h3>Chưa có nhân sự nào</h3>
        <p>Hệ thống chưa ghi nhận hồ sơ bác sĩ hoặc nhân sự nào.</p>
      </EmptyStateContainer>
    );
  }

  // 1) FILTER
  let filteredEmployees = allEmployees;
  const filterValue = searchParams.get("gender") || "all";

  if (filterValue === "male")
    filteredEmployees = filteredEmployees.filter((employee) => !employee.gender);
  if (filterValue === "female")
    filteredEmployees = filteredEmployees.filter((employee) => employee.gender);

  // 2) SEARCH FILTER
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  if (searchQuery) {
    filteredEmployees = filteredEmployees.filter((employee) => {
      const name = (employee.name || "").toLowerCase();
      const email = (employee.email || "").toLowerCase();
      const phone = (employee.phoneNumber || "").toLowerCase();
      const serviceName = (employee.service?.nameService || "").toLowerCase();
      return (
        name.includes(searchQuery) ||
        email.includes(searchQuery) ||
        phone.includes(searchQuery) ||
        serviceName.includes(searchQuery)
      );
    });
  }

  if (filteredEmployees.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy nhân sự phù hợp</h3>
        <p>Thử kiểm tra lại tên, email hoặc từ khóa tìm kiếm.</p>
      </EmptyStateContainer>
    );
  }

  // 3) SORT
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (typeof a[field] === "string") {
      return (a[field] || "").localeCompare(b[field] || "") * modifier;
    }
    return ((a[field] || 0) - (b[field] || 0)) * modifier;
  });

  // 4) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="1.8fr 1.3fr 0.8fr 1.8fr 0.6fr">
        <Table.Header>
          <div>Họ và tên</div>
          <div>Số điện thoại</div>
          <div>Giới tính</div>
          <div>Email</div>
          <div>Thao tác</div>
        </Table.Header>
        <Table.Body
          data={paginatedEmployees}
          render={(employee) => (
            <EmployeeRow employee={employee} key={employee._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={filteredEmployees.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default EmployeeTable;
