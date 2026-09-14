import { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import { ShieldCheck, Activity, ChevronLeft, ChevronRight } from "lucide-react";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  border-right: 1px solid var(--color-grey-100);
  grid-column: 1;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  z-index: 20;
  width: ${(props) => (props.$isCollapsed ? "7.6rem" : "28rem")};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SidebarHeader = styled.div`
  padding: ${(props) =>
    props.$isCollapsed ? "1.6rem 0.8rem 1.2rem" : "2.4rem 2rem 1.6rem"};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-100);
  position: relative;
  transition: padding 0.3s ease;
`;

const PortalBadge = styled.span`
  display: ${(props) => (props.$isCollapsed ? "none" : "inline-flex")};
  align-items: center;
  gap: 0.4rem;
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 0.3rem 0.8rem;
  border-radius: var(--border-radius-full);
  margin-top: 0.8rem;
  border: 1px solid var(--color-brand-200);
  white-space: nowrap;
`;

const NavWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${(props) => (props.$isCollapsed ? "1.4rem 0.6rem" : "1.6rem 1.4rem")};
  transition: padding 0.3s ease;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-200);
    border-radius: 4px;
  }
`;

const SidebarFooter = styled.div`
  padding: ${(props) => (props.$isCollapsed ? "1.2rem 0.8rem" : "1.6rem")};
  border-top: 1px solid var(--color-grey-100);
  background: var(--color-grey-50);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: padding 0.3s ease;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$isCollapsed ? "center" : "space-between")};
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-grey-500);

  .status-label {
    display: ${(props) => (props.$isCollapsed ? "none" : "flex")};
    align-items: center;
    gap: 0.5rem;
  }

  .status-state {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    span {
      display: ${(props) => (props.$isCollapsed ? "none" : "inline")};
    }
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #22c55e;
    box-shadow: 0 0 8px #22c55e;
    animation: pulseDot 2s infinite ease-in-out;
  }

  @keyframes pulseDot {
    0% {
      opacity: 0.6;
      transform: scale(0.9);
    }
    50% {
      opacity: 1;
      transform: scale(1.15);
    }
    100% {
      opacity: 0.6;
      transform: scale(0.9);
    }
  }
`;

const AdminProfileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$isCollapsed ? "center" : "flex-start")};
  gap: 1.2rem;
  padding: ${(props) => (props.$isCollapsed ? "0.6rem" : "0.8rem 1rem")};
  background: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-grey-200);
`;

const AvatarImg = styled.img`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-brand-500);
  flex-shrink: 0;
`;

const DefaultAvatar = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background: var(--color-brand-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.4rem;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  display: ${(props) => (props.$isCollapsed ? "none" : "flex")};
  flex-direction: column;
  min-width: 0;

  .name {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-800);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .role {
    font-size: 1.1rem;
    color: var(--color-brand-600);
    font-weight: 500;
  }
`;

const CollapseToggleButton = styled.button`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  color: var(--color-grey-600);
  padding: ${(props) => (props.$isCollapsed ? "0.8rem 0" : "0.8rem 1.2rem")};
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
  width: 100%;

  &:hover {
    color: var(--color-brand-600);
    border-color: var(--color-brand-400);
    background: var(--color-brand-50);
  }

  span {
    display: ${(props) => (props.$isCollapsed ? "none" : "inline")};
    white-space: nowrap;
  }
`;

function Sidebar({ isCollapsed = false, onToggle }) {
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
          setAdminUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadUser();
    window.addEventListener("userInfoUpdated", loadUser);
    return () => window.removeEventListener("userInfoUpdated", loadUser);
  }, []);

  const initials = adminUser?.name
    ? adminUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <StyledSidebar $isCollapsed={isCollapsed}>
      <SidebarHeader $isCollapsed={isCollapsed}>
        <Logo isCollapsed={isCollapsed} />
        <PortalBadge $isCollapsed={isCollapsed}>
          <ShieldCheck size={13} />
          Trung tâm Quản trị
        </PortalBadge>
      </SidebarHeader>

      <NavWrapper $isCollapsed={isCollapsed}>
        <MainNav isCollapsed={isCollapsed} />
      </NavWrapper>

      <SidebarFooter $isCollapsed={isCollapsed}>
        <StatusIndicator
          $isCollapsed={isCollapsed}
          title={isCollapsed ? "Hệ thống: Trực tuyến" : undefined}
        >
          <span className="status-label">
            <Activity size={13} />
            Hệ thống
          </span>
          <span className="status-state">
            <div className="status-dot" />
            <span>Trực tuyến</span>
          </span>
        </StatusIndicator>

        <AdminProfileCard
          $isCollapsed={isCollapsed}
          title={isCollapsed ? adminUser?.name || "Quản trị viên" : undefined}
        >
          {adminUser?.image ? (
            <AvatarImg src={adminUser.image} alt={adminUser.name} />
          ) : (
            <DefaultAvatar>{initials}</DefaultAvatar>
          )}
          <ProfileInfo $isCollapsed={isCollapsed}>
            <span className="name">{adminUser?.name || "Quản trị viên"}</span>
            <span className="role">Toàn quyền hệ thống</span>
          </ProfileInfo>
        </AdminProfileCard>

        {onToggle && (
          <CollapseToggleButton
            type="button"
            $isCollapsed={isCollapsed}
            onClick={onToggle}
            title={isCollapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Thu gọn thanh bên</span>
              </>
            )}
          </CollapseToggleButton>
        )}
      </SidebarFooter>
    </StyledSidebar>
  );
}

export default Sidebar;
