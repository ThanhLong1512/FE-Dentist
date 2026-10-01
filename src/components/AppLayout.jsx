import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import { useDarkMode } from "../hooks/useDarkMode";

const ModernFooter = lazy(() => import("./ModernFooter"));
const Chat = lazy(() =>
  new Promise((resolve) => {
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      resolve(import("./Chat"));
    };

    if (typeof window !== "undefined") {
      const idleId =
        "requestIdleCallback" in window
          ? window.requestIdleCallback(load, { timeout: 4000 })
          : setTimeout(load, 2500);

      window.addEventListener("pointerdown", load, { once: true, passive: true });
      window.addEventListener("keydown", load, { once: true, passive: true });
      window.addEventListener("scroll", load, { once: true, passive: true });
    } else {
      resolve(import("./Chat"));
    }
  })
);

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
      <Suspense fallback={null}>
        <ModernFooter />
        <Chat />
      </Suspense>
    </LayoutWrapper>
  );
}
