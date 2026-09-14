import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const ServiceTable = lazy(() => import("../../features/services/ServiceTable"));
const CreateService = lazy(() =>
  import("../../features/services/CreateService")
);
const ServiceOperations = lazy(() =>
  import("../../features/services/ServiceOperations")
);

function Service() {
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
        <Heading as="h1">Dịch vụ Nha khoa (Services)</Heading>
        <CreateService />
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <ServiceOperations />
        <ServiceTable />
      </Row>
    </>
  );
}

export default Service;
