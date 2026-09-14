import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  UserPlus,
  Building2,
  Sparkles,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import DashboardFilter from "./DashboardFilter";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const BannerCard = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-grey-0) 0%,
    rgba(2, 132, 199, 0.05) 50%,
    rgba(56, 189, 248, 0.08) 100%
  );
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem 2.8rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -30px;
    right: -30px;
    width: 160px;
    height: 160px;
    background: radial-gradient(
      circle,
      rgba(2, 132, 199, 0.12) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }
`;

const WelcomeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  .greeting {
    display: flex;
    align-items: center;
    gap: 1rem;

    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--color-grey-800);
      margin: 0;
      letter-spacing: -0.5px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--color-brand-50);
      color: var(--color-brand-700);
      font-size: 1.15rem;
      font-weight: 700;
      padding: 0.3rem 0.8rem;
      border-radius: var(--border-radius-full);
      border: 1px solid var(--color-brand-200);
    }
  }

  .subtext {
    font-size: 1.35rem;
    color: var(--color-grey-500);
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex-wrap: wrap;

    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--color-grey-400);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #10b981;
      font-weight: 600;
      font-size: 1.2rem;

      .pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }
    }
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.4rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.6rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  text-align: left;
  line-height: 1.3;
  min-width: 0;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-brand-400);
    box-shadow: var(--shadow-md);
    background: var(--color-brand-50);

    .arrow-icon {
      transform: translate(2px, -2px);
      color: var(--color-brand-600);
    }
  }

  .left-content {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    min-width: 0;

    .icon-box {
      width: 4.2rem;
      height: 4.2rem;
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: ${(props) => props.$bg || "var(--color-brand-100)"};
      color: ${(props) => props.$color || "var(--color-brand-700)"};
    }

    .text-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 0.35rem;
      min-width: 0;

      .action-title {
        display: block;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--color-grey-800);
        line-height: 1.25;
        margin: 0;
        padding: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .action-desc {
        display: block;
        font-size: 1.15rem;
        color: var(--color-grey-400);
        line-height: 1.25;
        margin: 0;
        padding: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .arrow-icon {
    color: var(--color-grey-400);
    transition: all 0.2s;
    flex-shrink: 0;
  }
`;

function DashboardHeader() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Quản trị viên");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.name) setUserName(user.name);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const now = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const currentDateFormatted = now.toLocaleDateString("vi-VN", dateOptions);

  return (
    <HeaderContainer>
      <BannerCard>
        <WelcomeGroup>
          <div className="greeting">
            <h1>Chào mừng trở lại, {userName}! 👋</h1>
            <span className="badge">
              <Sparkles size={12} /> Trung tâm điều hành
            </span>
          </div>
          <div className="subtext">
            <span>{currentDateFormatted}</span>
            <span className="dot" />
            <span className="status-badge">
              <div className="pulse-dot" />
              <span>4/4 Chi nhánh sẵn sàng phục vụ</span>
            </span>
          </div>
        </WelcomeGroup>

        <FilterWrapper>
          <DashboardFilter />
        </FilterWrapper>
      </BannerCard>

      <QuickActionsGrid>
        <QuickActionButton
          type="button"
          $bg="rgba(2, 132, 199, 0.1)"
          $color="#0284c7"
          onClick={() => navigate("/admin/appointments")}
        >
          <div className="left-content">
            <div className="icon-box">
              <CalendarDays size={20} />
            </div>
            <div className="text-group">
              <span className="action-title">Lịch Hẹn Khám</span>
              <span className="action-desc">Điều phối bệnh nhân</span>
            </div>
          </div>
          <ArrowUpRight size={18} className="arrow-icon" />
        </QuickActionButton>

        <QuickActionButton
          type="button"
          $bg="rgba(16, 185, 129, 0.1)"
          $color="#10b981"
          onClick={() => navigate("/admin/shifts")}
        >
          <div className="left-content">
            <div className="icon-box">
              <Clock size={20} />
            </div>
            <div className="text-group">
              <span className="action-title">Xếp Ca Trực</span>
              <span className="action-desc">Kéo & thả phân ca</span>
            </div>
          </div>
          <ArrowUpRight size={18} className="arrow-icon" />
        </QuickActionButton>

        <QuickActionButton
          type="button"
          $bg="rgba(168, 85, 247, 0.1)"
          $color="#a855f7"
          onClick={() => navigate("/admin/patients")}
        >
          <div className="left-content">
            <div className="icon-box">
              <UserPlus size={20} />
            </div>
            <div className="text-group">
              <span className="action-title">Hồ Sơ Bệnh Nhân</span>
              <span className="action-desc">Tiền sử & bệnh án</span>
            </div>
          </div>
          <ArrowUpRight size={18} className="arrow-icon" />
        </QuickActionButton>

        <QuickActionButton
          type="button"
          $bg="rgba(245, 158, 11, 0.1)"
          $color="#f59e0b"
          onClick={() => navigate("/admin/facilities")}
        >
          <div className="left-content">
            <div className="icon-box">
              <Building2 size={20} />
            </div>
            <div className="text-group">
              <span className="action-title">Cơ Sở Phòng Khám</span>
              <span className="action-desc">Mạng lưới chi nhánh</span>
            </div>
          </div>
          <ArrowUpRight size={18} className="arrow-icon" />
        </QuickActionButton>
      </QuickActionsGrid>
    </HeaderContainer>
  );
}

export default DashboardHeader;
