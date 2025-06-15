import styled from "styled-components";
import Spinner from "../../components/admin/Spinner";
import ServiceRow from "./ServiceRow";
import { useServices } from "./useServices";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";

function ServiceTable() {
  const { isLoading, services } = useServices();
  console.log("services", services);
  const [searchParams] = useSearchParams();
  if (isLoading) return <Spinner />;
  let filteredServices;

  const filterValue = searchParams.get("discount") || "all";
  if (filterValue === "all") filteredServices = services;
  if (filterValue === "no-discount")
    filteredServices = services.filter((service) => !service.priceDiscount);
  if (filterValue === "with-discount")
    filteredServices = services.filter((service) => service.priceDiscount);

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "nameService-asc";
  console.log("sortBy", sortBy);
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedServices = filteredServices.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );
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
          data={sortedServices}
          render={(service) => (
            <ServiceRow service={service} key={service._id} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default ServiceTable;
