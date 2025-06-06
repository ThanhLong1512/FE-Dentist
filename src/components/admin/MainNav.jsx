import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineUsers,
  HiMiniUserGroup,
  HiCube,
  HiTruck,
} from "react-icons/hi2";
import { IoTimer } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="admin/dashboard">
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/patients">
            <HiMiniUserGroup />
            <span>Patients</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/services">
            <HiCube />
            <span>Services</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/appointments">
            <HiOutlineCalendarDays />
            <span>Appointments</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/orders">
            <HiTruck />
            <span>Orders</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/shifts">
            <IoTimer />
            <span>Shifts</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/employees">
            <FaUserDoctor />
            <span>Employees</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/facilities">
            <BsBuildingsFill />
            <span>Facilities</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/users">
            <HiOutlineUsers />
            <span>Users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="admin/settings">
            <HiOutlineCog6Tooth />
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
