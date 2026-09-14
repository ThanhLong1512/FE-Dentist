import styled from "styled-components";
import { Building2, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import FacilityRow from "./FacilityRow";
import { useFacilities } from "./useFacilities";
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
    max-width: 34rem;
  }
`;

function FacilityTable() {
  const { isLoading, facilities = [] } = useFacilities();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const allFacilities = facilities || [];

  if (allFacilities.length === 0) {
    return (
      <EmptyStateContainer>
        <Building2 />
        <h3>Chưa có cơ sở phòng khám nào</h3>
        <p>Hệ thống chưa ghi nhận chi nhánh nào. Hãy nhấn "+ Thêm cơ sở mới" để khai báo.</p>
      </EmptyStateContainer>
    );
  }

  // 1) STATUS FILTER
  let filteredFacilities = allFacilities;
  const statusFilter = searchParams.get("status") || "all";
  if (statusFilter !== "all") {
    filteredFacilities = filteredFacilities.filter(
      (f) => f.status === statusFilter
    );
  }

  // 2) CITY FILTER
  const cityFilter = searchParams.get("city") || "all";
  if (cityFilter !== "all") {
    filteredFacilities = filteredFacilities.filter((f) => f.city === cityFilter);
  }

  // 3) SEARCH FILTER
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  if (searchQuery) {
    filteredFacilities = filteredFacilities.filter((f) => {
      const name = (f.name || "").toLowerCase();
      const code = (f.code || "").toLowerCase();
      const address = (f.address || "").toLowerCase();
      const city = (f.city || "").toLowerCase();
      const phone = (f.phoneNumber || "").toLowerCase();
      const manager = (f.managerName || "").toLowerCase();
      return (
        name.includes(searchQuery) ||
        code.includes(searchQuery) ||
        address.includes(searchQuery) ||
        city.includes(searchQuery) ||
        phone.includes(searchQuery) ||
        manager.includes(searchQuery)
      );
    });
  }

  if (filteredFacilities.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy cơ sở phù hợp</h3>
        <p>Thử thay đổi bộ lọc trạng thái, khu vực hoặc từ khóa tìm kiếm.</p>
      </EmptyStateContainer>
    );
  }

  // 4) SORT
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedFacilities = [...filteredFacilities].sort((a, b) => {
    if (field === "name" || field === "code" || field === "city") {
      return (String(a[field] || "").localeCompare(String(b[field] || ""))) * modifier;
    } else if (field === "chairCount") {
      return ((a.chairCount || 0) - (b.chairCount || 0)) * modifier;
    } else if (field === "createdAt") {
      return (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)) * modifier;
    }
    return 0;
  });

  // 5) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedFacilities = sortedFacilities.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="0.5fr 0.7fr 1.6fr 1.5fr 1.2fr 0.8fr 0.8fr 0.4fr">
        <Table.Header>
          <div>Ảnh</div>
          <div>Mã cơ sở</div>
          <div>Tên chi nhánh</div>
          <div>Địa chỉ</div>
          <div>Hotline & Giờ</div>
          <div>Quy mô</div>
          <div>Trạng thái</div>
          <div>Thao tác</div>
        </Table.Header>
        <Table.Body
          data={paginatedFacilities}
          render={(facility) => (
            <FacilityRow facility={facility} key={facility._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={filteredFacilities.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default FacilityTable;
