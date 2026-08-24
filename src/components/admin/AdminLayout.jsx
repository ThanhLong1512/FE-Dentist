import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import AdminChat from "./AdminChat";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  position: relative;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
`;

function AdminLayout() {
  return (
    <>
      <StyledAppLayout>
        <Header />
        <Sidebar />
        <Main>
          <Outlet />
        </Main>
        <AdminChat />
      </StyledAppLayout>
    </>
  );
}

export default AdminLayout;
