import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import OrderOperations from "../../features/order/OrderOperations";
import OrderTable from "../../features/order/OrderTable";
function Orders() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Order</Heading>
        <OrderOperations />
      </Row>
      <Row>
        <OrderTable />
      </Row>
    </>
  );
}

export default Orders;
