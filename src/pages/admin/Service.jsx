import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import ServiceTable from "../../features/services/ServiceTable";
import CreateService from "../../features/services/CreateService";
import ServiceOperations from "../../features/services/ServiceOperations";

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
