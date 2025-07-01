import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations from "../../components/admin/TableOperations";

function OrderOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All Orders" },
          { value: "successful", label: "Successful" },
          { value: "processing", label: "Processing" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />
      <SortBy
        options={[
          { value: "createAt-desc", label: "Sort by date (newest first)" },
          { value: "createAt-asc", label: "Sort by date (oldest first)" },
          { value: "customerName-asc", label: "Sort by customer name (A-Z)" },
          { value: "customerName-desc", label: "Sort by customer name (Z-A)" },
          { value: "totalPrice-desc", label: "Sort by price (high first)" },
          { value: "totalPrice-asc", label: "Sort by price (low first)" },
          { value: "status-asc", label: "Sort by status (A-Z)" },
          { value: "status-desc", label: "Sort by status (Z-A)" },
          { value: "service-asc", label: "Sort by service (A-Z)" },
          { value: "service-desc", label: "Sort by service (Z-A)" },
        ]}
      />
    </TableOperations>
  );
}

export default OrderOperations;
