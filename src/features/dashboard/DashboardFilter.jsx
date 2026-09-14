import Filter from "../../components/admin/Filter";

function DashboardFilter() {
  return (
    <Filter
      filterField="last"
      options={[
        { value: "7", label: "7 ngày qua" },
        { value: "30", label: "30 ngày qua" },
        { value: "90", label: "90 ngày qua" },
      ]}
    />
  );
}

export default DashboardFilter;
