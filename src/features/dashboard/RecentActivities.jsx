import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { format, isToday, isYesterday } from "date-fns";
import {
  Clock,
  CalendarCheck,
  CreditCard,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "../../utils/helpers";

const ActivityBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 2.4rem 2.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  transition: all 0.25s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-grey-100);
  padding-bottom: 1.4rem;

  .title-group {
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon-box {
      width: 3.6rem;
      height: 3.6rem;
      border-radius: var(--border-radius-md);
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h3 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--color-grey-800);
      margin: 0;
    }
  }

  .view-all-btn {
    background: transparent;
    border: none;
    color: var(--color-brand-600);
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.2s;

    &:hover {
      color: var(--color-brand-700);
      transform: translateX(2px);
    }
  }
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-200);
    border-radius: 4px;
  }
`;

const ActivityItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1rem 1.2rem;
  border-radius: var(--border-radius-md);
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  transition: all 0.2s;

  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-200);
    transform: translateX(2px);
  }

  .left {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    min-width: 0;

    .icon-wrap {
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: ${(props) => props.$bg};
      color: ${(props) => props.$color};
    }

    .content {
      display: flex;
      flex-direction: column;
      min-width: 0;

      .title-text {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--color-grey-800);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .detail-text {
        font-size: 1.15rem;
        color: var(--color-grey-400);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .time-badge {
    font-size: 1.15rem;
    color: var(--color-grey-400);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`;

const EmptyNotice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.2rem 1rem;
  color: var(--color-grey-400);
  gap: 0.8rem;
  font-size: 1.3rem;
`;

function formatFriendlyTime(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isToday(d)) {
      return `Hôm nay, ${format(d, "HH:mm")}`;
    }
    if (isYesterday(d)) {
      return `Hôm qua, ${format(d, "HH:mm")}`;
    }
    return format(d, "dd/MM, HH:mm");
  } catch {
    return dateStr;
  }
}

function RecentActivities({ orders, reviews }) {
  const navigate = useNavigate();
  const activities = [];

  if (orders?.orders) {
    orders.orders.forEach((order) => {
      const patientName = order.account?.name || "Khách hàng";
      const serviceName = order.service?.[0]?.nameService || "Dịch vụ nha khoa";

      activities.push({
        id: `ord-${order._id}`,
        type: "booking",
        title: `${patientName} đặt khám`,
        detail: `${serviceName} • ${formatCurrency(order.totalPrice || 0)}`,
        time: order.createdAt,
        bg: "rgba(2, 132, 199, 0.1)",
        color: "#0284c7",
        icon: <CalendarCheck size={18} />,
      });
    });
  }

  if (reviews?.reviews) {
    reviews.reviews.forEach((review) => {
      const reviewerName = review.account?.name || "Bệnh nhân";
      activities.push({
        id: `rev-${review._id}`,
        type: "review",
        title: `${reviewerName} đánh giá ${review.rating}⭐`,
        detail: review.comment || "Đánh giá chất lượng điều trị",
        time: review.createdAt,
        bg: "rgba(245, 158, 11, 0.1)",
        color: "#f59e0b",
        icon: <Star size={18} />,
      });
    });
  }

  // Demo fallback if no activities yet
  if (activities.length === 0) {
    activities.push(
      {
        id: "demo-1",
        type: "booking",
        title: "Bệnh nhân Nguyễn Văn An đặt lịch",
        detail: "Tẩy trắng răng Laser Whitening • Đã xác nhận",
        time: new Date().toISOString(),
        bg: "rgba(2, 132, 199, 0.1)",
        color: "#0284c7",
        icon: <CalendarCheck size={18} />,
      },
      {
        id: "demo-2",
        type: "payment",
        title: "Thanh toán thành công qua VNPAY",
        detail: "Mã đơn: ORD-9821 • 1.200.000 ₫",
        time: new Date(Date.now() - 3600000).toISOString(),
        bg: "rgba(16, 185, 129, 0.1)",
        color: "#10b981",
        icon: <CreditCard size={18} />,
      },
      {
        id: "demo-3",
        type: "review",
        title: "Trần Thị Mai để lại đánh giá 5⭐",
        detail: "Bác sĩ nhẹ nhàng, phòng khám rất sạch đẹp!",
        time: new Date(Date.now() - 7200000).toISOString(),
        bg: "rgba(245, 158, 11, 0.1)",
        color: "#f59e0b",
        icon: <Star size={18} />,
      }
    );
  }

  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <ActivityBox>
      <HeaderRow>
        <div className="title-group">
          <div className="icon-box">
            <Clock size={19} />
          </div>
          <h3>Nhật Ký Hoạt Động Mới Nhất</h3>
        </div>

        <button
          type="button"
          className="view-all-btn"
          onClick={() => navigate("/admin/appointments")}
        >
          <span>Xem tất cả</span>
          <ArrowRight size={14} />
        </button>
      </HeaderRow>

      <ActivityList>
        {activities.slice(0, 7).map((act) => (
          <ActivityItem
            key={act.id}
            $bg={act.bg}
            $color={act.color}
            onClick={() => navigate("/admin/appointments")}
            style={{ cursor: "pointer" }}
          >
            <div className="left">
              <div className="icon-wrap" style={{ background: act.bg, color: act.color }}>
                {act.icon}
              </div>
              <div className="content">
                <span className="title-text">{act.title}</span>
                <span className="detail-text">{act.detail}</span>
              </div>
            </div>

            <span className="time-badge">
              <Clock size={12} />
              <span>{formatFriendlyTime(act.time)}</span>
            </span>
          </ActivityItem>
        ))}
      </ActivityList>
    </ActivityBox>
  );
}

export default RecentActivities;
