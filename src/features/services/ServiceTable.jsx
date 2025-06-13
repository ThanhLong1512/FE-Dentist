import styled from "styled-components";
import Spinner from "../../components/admin/Spinner";
import ServiceRow from "./ServiceRow";
import { useServices } from "./useServices";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";

function ServiceTable() {
  const { isLoading, services } = useServices();

  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Service</div>
          <div>Unit</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={services}
          render={(service) => (
            <ServiceRow service={service} key={service._id} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default ServiceTable;
