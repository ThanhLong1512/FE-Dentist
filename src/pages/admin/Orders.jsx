import { lazy } from "react";
const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const OrderOperations = lazy(() =>
  import("../../features/order/OrderOperations")
);
const OrderTable = lazy(() => import("../../features/order/OrderTable"));
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
