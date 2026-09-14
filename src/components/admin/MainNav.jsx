import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  ShoppingBag,
  Clock,
  UserCheck,
  Building2,
  Shield,
  Settings,
} from "lucide-react";

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const GroupTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--color-grey-400);
  padding: 0 1.6rem;
  margin-bottom: 0.4rem;
  display: ${(props) => (props.$isCollapsed ? "none" : "block")};
  white-space: nowrap;
`;

const GroupDivider = styled.hr`
  display: ${(props) => (props.$isCollapsed ? "block" : "none")};
  border: none;
  border-top: 1px solid var(--color-grey-100);
  margin: 0.6rem auto;
  width: 3.6rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.$isCollapsed ? "center" : "flex-start")};
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.4rem;
    font-weight: 500;
    padding: ${(props) => (props.$isCollapsed ? "1rem 0" : "1rem 1.6rem")};
    border-radius: var(--border-radius-md);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    width: ${(props) => (props.$isCollapsed ? "4.4rem" : "100%")};
    margin: ${(props) => (props.$isCollapsed ? "0 auto" : "0")};
  }

  &:hover {
    color: var(--color-brand-600);
    background-color: var(--color-grey-50);
    transform: ${(props) => (props.$isCollapsed ? "scale(1.08)" : "translateX(3px)")};
  }

  &.active:link,
  &.active:visited {
    color: var(--color-brand-700);
    background: var(--color-brand-50);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(2, 132, 199, 0.08);

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 15%;
      bottom: 15%;
      width: ${(props) => (props.$isCollapsed ? "3px" : "4px")};
      border-radius: 0 4px 4px 0;
      background: var(--color-brand-600);
    }
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-400);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  &:hover svg {
    color: var(--color-brand-600);
    transform: scale(1.05);
  }

  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }

  .nav-label {
    display: ${(props) => (props.$isCollapsed ? "none" : "inline")};
    white-space: nowrap;
  }
`;

function MainNav({ isCollapsed = false }) {
  return (
    <NavContainer>
      <NavGroup>
        <GroupTitle $isCollapsed={isCollapsed}>Tổng quan</GroupTitle>
        <GroupDivider $isCollapsed={isCollapsed} />
        <NavList>
          <li>
            <StyledNavLink
              to="/admin/dashboard"
              title="Bảng điều khiển"
              $isCollapsed={isCollapsed}
            >
              <LayoutDashboard size={19} />
              <span className="nav-label">Bảng điều khiển</span>
            </StyledNavLink>
          </li>
        </NavList>
      </NavGroup>

      <NavGroup>
        <GroupTitle $isCollapsed={isCollapsed}>Lâm sàng & Khách hàng</GroupTitle>
        <GroupDivider $isCollapsed={isCollapsed} />
        <NavList>
          <li>
            <StyledNavLink
              to="/admin/patients"
              title="Bệnh nhân"
              $isCollapsed={isCollapsed}
            >
              <Users size={19} />
              <span className="nav-label">Bệnh nhân</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink
              to="/admin/appointments"
              title="Lịch hẹn khám"
              $isCollapsed={isCollapsed}
            >
              <CalendarDays size={19} />
              <span className="nav-label">Lịch hẹn khám</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink
              to="/admin/services"
              title="Dịch vụ nha khoa"
              $isCollapsed={isCollapsed}
            >
              <Stethoscope size={19} />
              <span className="nav-label">Dịch vụ nha khoa</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink
              to="/admin/orders"
              title="Đơn hàng"
              $isCollapsed={isCollapsed}
            >
              <ShoppingBag size={19} />
              <span className="nav-label">Đơn hàng</span>
            </StyledNavLink>
          </li>
        </NavList>
      </NavGroup>

      <NavGroup>
        <GroupTitle $isCollapsed={isCollapsed}>Quản trị nội bộ</GroupTitle>
        <GroupDivider $isCollapsed={isCollapsed} />
        <NavList>
          <li>
            <StyledNavLink
              to="/admin/shifts"
              title="Ca trực bác sĩ"
              $isCollapsed={isCollapsed}
            >
              <Clock size={19} />
              <span className="nav-label">Ca trực bác sĩ</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink
              to="/admin/employees"
              title="Bác sĩ & Nhân sự"
              $isCollapsed={isCollapsed}
            >
              <UserCheck size={19} />
              <span className="nav-label">Bác sĩ & Nhân sự</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink
              to="/admin/facilities"
              title="Cơ sở phòng khám"
              $isCollapsed={isCollapsed}
            >
              <Building2 size={19} />
              <span className="nav-label">Cơ sở phòng khám</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink
              to="/admin/users"
              title="Tài khoản người dùng"
              $isCollapsed={isCollapsed}
            >
              <Shield size={19} />
              <span className="nav-label">Tài khoản người dùng</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink
              to="/admin/settings"
              title="Cài đặt hệ thống"
              $isCollapsed={isCollapsed}
            >
              <Settings size={19} />
              <span className="nav-label">Cài đặt hệ thống</span>
            </StyledNavLink>
          </li>
        </NavList>
      </NavGroup>
    </NavContainer>
  );
}

export default MainNav;
