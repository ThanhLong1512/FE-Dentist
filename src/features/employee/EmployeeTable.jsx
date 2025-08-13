import styled from "styled-components";
import Spinner from "../../components/admin/Spinner";
import EmployeeRow from "./EmployeeRow";
import { useEmployees } from "./useEmployees";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

function EmployeeTable() {
  const { isLoading, employees } = useEmployees();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  // 1) FILTER
  let filteredEmployees;
  const filterValue = searchParams.get("gender") || "all";

  if (filterValue === "all") filteredEmployees = employees;
  if (filterValue === "male")
    filteredEmployees = employees.filter((employee) => !employee.gender);
  if (filterValue === "female")
    filteredEmployees = employees.filter((employee) => employee.gender);

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedEmployees = filteredEmployees.sort((a, b) => {
    if (typeof a[field] === "string") {
      return a[field].localeCompare(b[field]) * modifier;
    }
    return (a[field] - b[field]) * modifier;
  });

  // 3) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="2fr 1.5fr 1fr 2fr 0.1fr">
        <Table.Header>
          <div>Name</div>
          <div>Phone</div>
          <div>Gender</div>
          <div>Email</div>
          <div>Actions</div>
        </Table.Header>
        <Table.Body
          data={paginatedEmployees}
          render={(employee) => (
            <EmployeeRow employee={employee} key={employee._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={sortedEmployees.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default EmployeeTable;
