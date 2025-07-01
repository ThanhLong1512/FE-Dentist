import Spinner from "../../components/admin/Spinner";
import OrderRow from "./OrderRow";
import { useOrders } from "./useOrders";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

function OrderTable() {
  const { isLoading, orders } = useOrders();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  let filteredOrders;
  const filterValue = searchParams.get("status") || "all";
  if (filterValue === "all") filteredOrders = orders;
  if (filterValue === "successful")
    filteredOrders = orders.filter((order) => order.status === "Successful");
  if (filterValue === "cancelled")
    filteredOrders = orders.filter((order) => order.status === "Cancelled");
  if (filterValue === "processing")
    filteredOrders = orders.filter((order) => order.status === "Processing");
  const sortBy = searchParams.get("sortBy") || "createAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedOrders = filteredOrders?.sort((a, b) => {
    if (field === "customerName") {
      return a.account.name.localeCompare(b.account.name) * modifier;
    } else if (field === "createAt") {
      return (new Date(a.createAt) - new Date(b.createAt)) * modifier;
    } else if (field === "totalPrice") {
      return (a.totalPrice - b.totalPrice) * modifier;
    } else if (field === "status") {
      return a.status.localeCompare(b.status) * modifier;
    } else if (field === "service") {
      return (
        a.service[0].nameService.localeCompare(b.service[0].nameService) *
        modifier
      );
    } else {
      return (a[field] - b[field]) * modifier;
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
