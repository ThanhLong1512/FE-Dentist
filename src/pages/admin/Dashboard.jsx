import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const DashboardFilter = lazy(() =>
  import("../../features/dashboard/DashboardFilter")
);
const DashboardLayout = lazy(() =>
  import("../../features/dashboard/DashboardLayout")
);

function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>

      <DashboardLayout />
    </>
  );
}

export default Dashboard;
