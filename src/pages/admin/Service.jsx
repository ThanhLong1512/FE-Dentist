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
      <Row type="horizontal">
        <Heading as="h1">Service</Heading>
        <ServiceOperations />
      </Row>
      <Row>
        <ServiceTable />

        <CreateService />
      </Row>
    </>
  );
}

export default Service;
