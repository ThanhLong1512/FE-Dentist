import styled from "styled-components";
import { useLocation } from "react-router-dom";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../../features/authentication/UserAvatar";
import { Sparkles, Activity, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const StyledHeader = styled.header`
  background-color: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1.4rem 3.2rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: space-between;
  grid-column: 2;
  grid-row: 1;
  z-index: 10;
  transition: all 0.3s ease;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const SidebarToggleBtn = styled.button`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  color: var(--color-grey-600);
  width: 3.8rem;
  height: 3.8rem;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;

  &:hover {
    color: var(--color-brand-600);
    border-color: var(--color-brand-400);
    background: var(--color-brand-50);
    transform: scale(1.04);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-grey-800);
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0;
`;

const PageDescription = styled.span`
  font-size: 1.25rem;
  color: var(--color-grey-400);
  font-weight: 400;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const QuickStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-grey-500);
  background: var(--color-grey-100);
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-full);

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const ROUTE_TITLES = {
  "/admin/dashboard": {
    title: "Bảng điều khiển",
    desc: "Tổng quan các chỉ số vận hành & tài chính phòng khám",
  },
  "/admin/patients": {
    title: "Hồ sơ Bệnh nhân",
    desc: "Quản lý thông tin, tiền sử khám & liên hệ của bệnh nhân",
  },
  "/admin/appointments": {
    title: "Lịch hẹn khám",
    desc: "Điều phối và theo dõi lịch khám chữa bệnh theo thời gian thực",
  },
  "/admin/services": {
    title: "Dịch vụ nha khoa",
    desc: "Danh mục liệu trình điều trị, bảng giá và gói dịch vụ",
  },
  "/admin/orders": {
    title: "Quản lý đơn hàng",
    desc: "Theo dõi đơn đặt mua sản phẩm & thanh toán của khách hàng",
  },
  "/admin/shifts": {
    title: "Ca trực bác sĩ",
    desc: "Lịch phân ca làm việc & phòng khám chuyên khoa",
  },
  "/admin/employees": {
    title: "Bác sĩ & Nhân sự",
    desc: "Danh sách bác sĩ, phụ tá và nhân viên điều dưỡng",
  },
  "/admin/facilities": {
    title: "Cơ sở phòng khám",
    desc: "Mạng lưới chi nhánh phòng khám và trang thiết bị",
  },
  "/admin/users": {
    title: "Tài khoản người dùng",
    desc: "Phân quyền và bảo mật danh sách tài khoản hệ thống",
  },
  "/admin/settings": {
    title: "Cài đặt hệ thống",
    desc: "Cấu hình chính sách, email và thông số vận hành",
  },
};

function Header({ isSidebarCollapsed = false, onToggleSidebar }) {
  const location = useLocation();
  const currentInfo = ROUTE_TITLES[location.pathname] || {
    title: "Quản trị Nha Khoa",
    desc: "Hệ thống quản trị nha khoa số Cheese Dental",
  };

  return (
    <StyledHeader>
      <HeaderLeft>
        {onToggleSidebar && (
          <SidebarToggleBtn
            type="button"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Mở rộng thanh điều hướng (M)" : "Thu gọn thanh điều hướng (M)"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </SidebarToggleBtn>
        )}
        <TitleWrapper>
          <PageTitle>{currentInfo.title}</PageTitle>
          <PageDescription>{currentInfo.desc}</PageDescription>
        </TitleWrapper>
      </HeaderLeft>

      <HeaderRight>
        <QuickStatus>
          <span className="dot" />
          <span>Realtime Server: Sẵn sàng</span>
        </QuickStatus>
        <UserAvatar />
        <HeaderMenu />
      </HeaderRight>
    </StyledHeader>
  );
}

export default Header;
