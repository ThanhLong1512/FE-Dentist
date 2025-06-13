import styled from "styled-components";

import Spinner from "../../components/admin/Spinner";
import ServiceRow from "./ServiceRow";
import { useServices } from "./useServices";
import Table from "../../components/admin/Table";

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function ServiceTable() {
  const { isLoading, services } = useServices();
  console.log(services);

  if (isLoading) return <Spinner />;

  return (
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
        render={(service) => <ServiceRow service={service} key={service._id} />}
      />
    </Table>
  );
}

export default ServiceTable;
