import {
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";

function Stats({ bookings, confirmedOrders, averageRating, reviewCount }) {
  const numBookings = bookings?.count;
  const totalRevenue = confirmedOrders?.totalRevenue;

  const ratingToPercentage = (rating, maxRating = 5) => {
    if (!rating) return 0;
    return Math.round((rating / maxRating) * 100);
  };

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        title="Bookings"
        value={numBookings}
        color="blue"
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(totalRevenue)}
      />
      <Stat
        title="Reviews"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={reviewCount}
      />
      <Stat
        title="Rating Score"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={ratingToPercentage(averageRating) + "%"}
      />
    </>
  );
}

export default Stats;
