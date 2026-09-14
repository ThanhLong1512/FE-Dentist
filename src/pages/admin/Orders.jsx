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
      <Row
        type="horizontal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.2rem",
          marginBottom: "0.8rem",
        }}
      >
        <Heading as="h1">Đơn hàng & Doanh thu (Orders)</Heading>
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <OrderOperations />
        <OrderTable />
      </Row>
    </>
  );
}

export default Orders;
