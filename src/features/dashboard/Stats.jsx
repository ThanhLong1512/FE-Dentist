import {
  CalendarCheck,
  CircleDollarSign,
  MessageSquareHeart,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";

function Stats({ bookings, confirmedOrders, averageRating, reviewCount }) {
  const numBookings = bookings?.count ?? 0;
  const totalRevenue = confirmedOrders?.totalRevenue ?? 0;

  const ratingToPercentage = (rating, maxRating = 5) => {
    if (!rating) return 0;
    return Math.round((rating / maxRating) * 100);
  };

  const safeRating = Number(averageRating || 5);
  const satisfactionRate = ratingToPercentage(safeRating);

  return (
    <>
      <Stat
        icon={<CalendarCheck />}
        title="Lịch Hẹn Đặt Mới"
        value={`${numBookings} ca khám`}
        badgeText="+12.5% kỳ này"
        badgeType="growth"
        sublabel="Bệnh nhân đã đăng ký"
        bg="rgba(2, 132, 199, 0.1)"
        color="#0284c7"
        gradient="linear-gradient(90deg, #0284c7, #38bdf8)"
        shadow="rgba(2, 132, 199, 0.2)"
      />

      <Stat
        icon={<CircleDollarSign />}
        title="Tổng Doanh Thu"
        value={formatCurrency(totalRevenue)}
        badgeText="Đã thanh toán"
        badgeType="growth"
        sublabel="Từ liệu trình & đơn hàng"
        bg="rgba(16, 185, 129, 0.1)"
        color="#10b981"
        gradient="linear-gradient(90deg, #10b981, #34d399)"
        shadow="rgba(16, 185, 129, 0.2)"
      />

      <Stat
        icon={<MessageSquareHeart />}
        title="Phản Hồi & Đánh Giá"
        value={`${reviewCount} lượt`}
        badgeText="Tương tác cao"
        badgeType="growth"
        sublabel="Góp ý từ khách hàng"
        bg="rgba(99, 102, 241, 0.1)"
        color="#6366f1"
        gradient="linear-gradient(90deg, #6366f1, #818cf8)"
        shadow="rgba(99, 102, 241, 0.2)"
      />

      <Stat
        icon={<Sparkles />}
        title="Chỉ Số Hài Lòng (CSAT)"
        value={`${safeRating.toFixed(1)} / 5.0 ⭐`}
        badgeText={`${satisfactionRate}% hài lòng`}
        badgeType="rating"
        sublabel="Chất lượng dịch vụ vượt trội"
        bg="rgba(245, 158, 11, 0.1)"
        color="#f59e0b"
        gradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
        shadow="rgba(245, 158, 11, 0.2)"
      />
    </>
  );
}

export default Stats;
