import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import ModernFooter from "./ModernFooter";
import Chat from "./Chat";
import { useDarkMode } from "../hooks/useDarkMode";

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.$isDark ? "#0b1329" : "#ffffff"};
  color: ${(props) =>
    props.$isDark ? "#f8fafc" : "#1e293b"};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default function AppLayout() {
  const { isDarkMode } = useDarkMode();

  return (
    <LayoutWrapper $isDark={isDarkMode}>
      <Navbar />
      <MainContent>
        <Outlet />
      </MainContent>
      <ModernFooter />
      <Chat />
    </LayoutWrapper>
  );
}
