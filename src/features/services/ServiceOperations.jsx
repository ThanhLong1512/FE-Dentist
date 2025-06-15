import Filter from "../../components/admin/Filter";
import SortBy from "../../components/admin/SortBy";
import TableOperations from "../../components/admin/TableOperations";
function ServiceOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />
      <SortBy
        options={[
          { value: "nameService-asc", label: "Sort by name (A-Z)" },
          { value: "nameService-desc", label: "Sort by name (Z-A)" },
          { value: "priceService-asc", label: "Sort by price (low first)" },
          { value: "priceService-desc", label: "Sort by price (high first)" },
        ]}
      />
    </TableOperations>
  );
}

export default ServiceOperations;
