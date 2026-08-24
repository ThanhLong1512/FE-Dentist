import Spinner from "../../components/admin/Spinner";
import OrderRow from "./OrderRow";
import { useOrders } from "./useOrders";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

function OrderTable() {
  const { isLoading, error, orders } = useOrders();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-red-700)" }}>
        {error?.message || "Không thể tải danh sách đơn hàng"}
      </div>
    );

  const safeOrders = orders || [];
  let filteredOrders;
  const filterValue = searchParams.get("status") || "all";
  if (filterValue === "all") filteredOrders = safeOrders;
  else if (filterValue === "successful")
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
  else filteredOrders = safeOrders;

  const sortBy = searchParams.get("sortBy") || "createAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedOrders = [...(filteredOrders || [])].sort((a, b) => {
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

  if (safeOrders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-grey-600)" }}>
        No orders available
      </div>
    );
  }

  return (
    <Menus>
      <Table columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>Customer</div>
          <div>Service</div>
          <div>Status</div>
          <div>Total Price</div>
          <div>Payment Method</div>
          <div>Order Date</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={paginatedOrders}
          render={(order) => <OrderRow order={order} key={order._id} />}
        />
        <Table.Footer>
          <Pagination count={sortedOrders?.length || 0} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default OrderTable;
