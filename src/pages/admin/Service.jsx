import { useState } from "react";
import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import ServiceTable from "../../features/services/ServiceTable";
import Button from "../../components/admin/Button";
import CreateServiceForm from "../../features/services/CreateServiceForm";
import CreateService from "../../features/services/CreateService";

function Service() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Service</Heading>
        <p>Filter / Sort</p>
      </Row>
      <Row>
        <ServiceTable />

        <CreateService />
      </Row>
    </>
  );
}

export default Service;
