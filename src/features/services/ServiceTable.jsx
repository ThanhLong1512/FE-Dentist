import styled from "styled-components";
import { Sparkles, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import ServiceRow from "./ServiceRow";
import { useServices } from "./useServices";
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

function ServiceTable() {
  const { isLoading, services = [] } = useServices();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const allServices = services || [];

  if (allServices.length === 0) {
    return (
      <EmptyStateContainer>
        <Sparkles />
        <h3>Chưa có dịch vụ nào</h3>
        <p>Hệ thống chưa ghi nhận dịch vụ nha khoa nào hoặc dữ liệu đang trống.</p>
      </EmptyStateContainer>
    );
  }

  // 1) FILTER
  let filteredServices = allServices;
  const filterValue = searchParams.get("discount") || "all";

  if (filterValue === "no-discount")
    filteredServices = filteredServices.filter((service) => !service.priceDiscount);
  if (filterValue === "with-discount")
    filteredServices = filteredServices.filter((service) => service.priceDiscount);

  // 2) SEARCH FILTER
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  if (searchQuery) {
    filteredServices = filteredServices.filter((service) => {
      const name = (service.nameService || "").toLowerCase();
      const unit = (service.Unit || "").toLowerCase();
      const summary = (service.summary || "").toLowerCase();
      return (
        name.includes(searchQuery) ||
        unit.includes(searchQuery) ||
        summary.includes(searchQuery)
      );
    });
  }

  if (filteredServices.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy dịch vụ phù hợp</h3>
        <p>Thử thay đổi bộ lọc giá hoặc từ khóa tìm kiếm dịch vụ.</p>
      </EmptyStateContainer>
    );
  }

  // 3) SORT
  const sortBy = searchParams.get("sortBy") || "nameService-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (field === "nameService") {
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
  const paginatedServices = sortedServices.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 1.2fr 1.2fr 1.2fr 0.6fr">
        <Table.Header>
          <div>Ảnh</div>
          <div>Dịch vụ</div>
          <div>Đơn vị tính</div>
          <div>Giá niêm yết</div>
          <div>Giá ưu đãi</div>
          <div>Thao tác</div>
        </Table.Header>
        <Table.Body
          data={paginatedServices}
          render={(service) => (
            <ServiceRow service={service} key={service._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={filteredServices.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default ServiceTable;
