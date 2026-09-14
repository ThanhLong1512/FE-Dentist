import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import Stats from "./Stats";
import { useRecentOrder } from "./useRecentOrder";
import { useRecentReview } from "./useRecentReview";
import Spinner from "../../components/admin/Spinner";
import SalesChart from "./SalesChart";
import ServiceChart from "./ServiceChart";
import RecentActivities from "./RecentActivities";
import ClinicOverviewBox from "./ClinicOverviewBox";

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.8rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AnalyticsRow = styled.div`
  display: grid;
  grid-template-columns: 1.55fr 1.15fr;
  gap: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const OperationsRow = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

function DashboardLayout() {
  const { isLoading, bookings } = useRecentBookings();
  const { isLoading: isLoadingOrder, orders, numDays } = useRecentOrder();
  const { isLoading: isLoadingReview, reviews } = useRecentReview();

  if (isLoading || isLoadingOrder || isLoadingReview) return <Spinner />;

  const averageRating = !reviews ? 5 : reviews.averageRating;
  const reviewCount = !reviews ? 0 : reviews.totalReviews;

  return (
    <DashboardContent>
      <StatsGrid>
        <Stats
          bookings={bookings}
          confirmedOrders={orders}
          averageRating={averageRating}
          reviewCount={reviewCount}
        />
      </StatsGrid>

      <AnalyticsRow>
        <SalesChart orders={orders} numDays={numDays} />
        <ServiceChart confirmedOrder={orders} />
      </AnalyticsRow>

      <OperationsRow>
        <RecentActivities orders={orders} reviews={reviews} />
        <ClinicOverviewBox />
      </OperationsRow>
    </DashboardContent>
  );
}

export default DashboardLayout;
