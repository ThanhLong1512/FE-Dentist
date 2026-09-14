import styled from "styled-components";
import { PackageX, Search } from "lucide-react";
import Spinner from "../../components/admin/Spinner";
import OrderRow from "./OrderRow";
import { useOrders } from "./useOrders";
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

function OrderTable() {
  const { isLoading, error, orders = [] } = useOrders();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-red-700)" }}>
        {error?.message || "Không thể tải danh sách đơn hàng"}
      </div>
    );

  const safeOrders = orders || [];

  if (safeOrders.length === 0) {
    return (
      <EmptyStateContainer>
        <PackageX />
        <h3>Chưa có đơn hàng nào</h3>
        <p>Hệ thống chưa ghi nhận đơn thanh toán dịch vụ nào.</p>
      </EmptyStateContainer>
    );
  }

  let filteredOrders = safeOrders;
  const filterValue = searchParams.get("status") || "all";
  if (filterValue === "successful")
    filteredOrders = safeOrders.filter(
      (o) => (o.status || "").toLowerCase() === "successful"
    );
  else if (filterValue === "cancelled")
    filteredOrders = safeOrders.filter(
      (o) => (o.status || "").toLowerCase() === "cancelled"
    );
  else if (filterValue === "processing")
    filteredOrders = safeOrders.filter(
      (o) => (o.status || "").toLowerCase() === "processing"
    );

  // Search filter
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  if (searchQuery) {
    filteredOrders = filteredOrders.filter((o) => {
      const customerName = (o.account?.name || "").toLowerCase();
      const customerEmail = (o.account?.email || "").toLowerCase();
      const orderId = (o._id || "").toLowerCase();
      const serviceName = (o.service?.[0]?.nameService || "").toLowerCase();
      return (
        customerName.includes(searchQuery) ||
        customerEmail.includes(searchQuery) ||
        orderId.includes(searchQuery) ||
        serviceName.includes(searchQuery)
      );
    });
  }

  if (filteredOrders.length === 0) {
    return (
      <EmptyStateContainer>
        <Search />
        <h3>Không tìm thấy đơn hàng phù hợp</h3>
        <p>Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.</p>
      </EmptyStateContainer>
    );
  }

  const sortBy = searchParams.get("sortBy") || "createAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (field === "customerName") {
      return ((a.account?.name || "").localeCompare(b.account?.name || "")) * modifier;
    } else if (field === "createAt" || field === "createdAt") {
      const aDate = a.createAt || a.createdAt || 0;
      const bDate = b.createAt || b.createdAt || 0;
      return (new Date(aDate) - new Date(bDate)) * modifier;
    } else if (field === "totalPrice") {
      return ((a.totalPrice || 0) - (b.totalPrice || 0)) * modifier;
    } else if (field === "status") {
      return ((a.status || "").localeCompare(b.status || "")) * modifier;
    } else if (field === "service") {
      const aName = a.service?.[0]?.nameService || "";
      const bName = b.service?.[0]?.nameService || "";
      return aName.localeCompare(bName) * modifier;
    } else {
      return ((a[field] || 0) - (b[field] || 0)) * modifier;
    }
  });

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  return (
    <Menus>
      <Table columns="1fr 1.6fr 1.2fr 1fr 1.2fr 0.6fr">
        <Table.Header>
          <div>Mã đơn hàng</div>
          <div>Khách hàng</div>
          <div>Dịch vụ</div>
          <div>Trạng thái</div>
          <div>Tổng tiền</div>
          <div>Thao tác</div>
        </Table.Header>
        <Table.Body
          data={paginatedOrders}
          render={(order) => <OrderRow order={order} key={order._id} />}
        />
        <Table.Footer>
          <Pagination count={filteredOrders.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default OrderTable;
