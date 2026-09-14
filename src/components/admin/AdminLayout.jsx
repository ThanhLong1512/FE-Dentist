import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import AdminChat from "./AdminChat";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isCollapsed ? "7.6rem 1fr" : "28rem 1fr"};
  grid-template-rows: auto 1fr;
  height: 100vh;
  position: relative;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  background-color: var(--color-grey-50);
  overflow: hidden;
  transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 2.8rem 3.2rem 6rem;
  overflow-y: auto;
  overflow-x: hidden;
  grid-column: 2;
  grid-row: 2;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-grey-400);
  }
`;

const ContentContainer = styled.div`
  max-width: 172rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
`;

function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <StyledAppLayout $isCollapsed={isSidebarCollapsed}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      <Main>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </Main>
      <AdminChat />
    </StyledAppLayout>
  );
}

export default AdminLayout;
