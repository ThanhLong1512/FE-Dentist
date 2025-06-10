import { useState } from "react";
import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import ServiceTable from "../../features/services/ServiceTable";
import Button from "../../components/admin/Button";
import CreateServiceForm from "../../features/services/CreateServiceForm";

function Service() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Service</Heading>
        <p>Filter / Sort</p>
      </Row>
      <Row>
        <ServiceTable />

        <Button onClick={() => setShowForm((show) => !show)}>
          Add new service
        </Button>
        {showForm && <CreateServiceForm />}
      </Row>
    </>
  );
}

export default Service;
