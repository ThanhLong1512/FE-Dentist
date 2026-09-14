import { lazy } from "react";
import styled from "styled-components";

const DashboardHeader = lazy(() =>
  import("../../features/dashboard/DashboardHeader")
);
const DashboardLayout = lazy(() =>
  import("../../features/dashboard/DashboardLayout")
);

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  width: 100%;
`;

function Dashboard() {
  return (
    <DashboardWrapper>
      <DashboardHeader />
      <DashboardLayout />
    </DashboardWrapper>
  );
}

export default Dashboard;
