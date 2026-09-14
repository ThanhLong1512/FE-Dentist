import styled from "styled-components";
import { UserX, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import PatientRow from "./PatientRow";
import { usePatients } from "./usePatients";
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

function PatientTable() {
  const { isLoading, patients = [] } = usePatients();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const allPatients = patients || [];

  if (allPatients.length === 0) {
    return (
      <EmptyStateContainer>
        <UserX />
        <h3>Chưa có bệnh nhân nào</h3>
        <p>Hệ thống chưa ghi nhận thông tin bệnh nhân nào.</p>
      </EmptyStateContainer>
    );
  }

  // 1) GENDER FILTER
  let filteredPatients = allPatients;
  const filterValue = searchParams.get("gender") || "all";
  if (filterValue === "male")
    filteredPatients = filteredPatients.filter((patient) => patient.gender === true);
  if (filterValue === "female")
    filteredPatients = filteredPatients.filter((patient) => patient.gender === false);

  // 2) SEARCH FILTER
  const searchQuery = (searchParams.get("q") || searchParams.get("search") || "").trim().toLowerCase();
  if (searchQuery) {
    filteredPatients = filteredPatients.filter((patient) => {
      const name = (patient.name || "").toLowerCase();
      const phone = (patient.phoneNumber || "").toLowerCase();
      const address = (patient.address || "").toLowerCase();
      return (
        name.includes(searchQuery) ||
        phone.includes(searchQuery) ||
        address.includes(searchQuery)
      );
    });
  }

  if (filteredPatients.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy bệnh nhân phù hợp</h3>
        <p>Thử thay đổi bộ lọc giới tính hoặc từ khóa tìm kiếm.</p>
      </EmptyStateContainer>
    );
  }

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "yearOfBirth-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (field === "name") {
      return (a[field] || "").localeCompare(b[field] || "") * modifier;
    } else {
      return ((a[field] || 0) - (b[field] || 0)) * modifier;
    }
  });

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedPatients = sortedPatients.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="1.2fr 0.6fr 0.9fr 1fr 1.6fr 0.6fr">
        <Table.Header>
          <div>Họ và tên</div>
          <div>Giới tính</div>
          <div>Năm sinh</div>
          <div>Số điện thoại</div>
          <div>Địa chỉ</div>
          <div>Thao tác</div>
        </Table.Header>
        <Table.Body
          data={paginatedPatients}
          render={(patient) => (
            <PatientRow patient={patient} key={patient._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={filteredPatients.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default PatientTable;
