import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import Stats from "./Stats";
import { useRecentOrder } from "./useRecentOrder";
import { useRecentReview } from "./useRecentReview";
import Spinner from "../../components/admin/Spinner";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isLoading, bookings } = useRecentBookings();
  const { isLoading: isLoadingOrder, orders } = useRecentOrder();
  const { isLoading: isLoadingReview, reviews } = useRecentReview();

  if (isLoading || isLoadingOrder || isLoadingReview) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedOrders={orders}
        averageRating={reviews.averageRating}
        reviewCount={reviews.totalReviews}
      />
      {/* <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} /> */}
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
