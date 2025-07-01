import styled from "styled-components";
import Spinner from "../../components/admin/Spinner";
import ServiceRow from "./ServiceRow";
import { useServices } from "./useServices";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";

function ServiceTable() {
  const { isLoading, services } = useServices();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  // 1) FILTER
  let filteredServices;
  const filterValue = searchParams.get("discount") || "all";

  if (filterValue === "all") filteredServices = services;
  if (filterValue === "no-discount")
    filteredServices = services.filter((service) => !service.priceDiscount);
  if (filterValue === "with-discount")
    filteredServices = services.filter((service) => service.priceDiscount);

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "nameService-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedServices = filteredServices.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  // 3) PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedServices = sortedServices.slice(startIndex, endIndex);

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
          data={paginatedServices}
          render={(service) => (
            <ServiceRow service={service} key={service._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={sortedServices.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default ServiceTable;
