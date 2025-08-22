import styled from "styled-components";
import Heading from "../../components/admin/Heading";
import { format } from "date-fns";

const ActivityBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 3.2rem;
  grid-column: 1 / span 2;
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;

  &.booking {
    background-color: var(--color-blue-100);
    color: var(--color-blue-700);
  }

  &.payment {
    background-color: var(--color-green-100);
    color: var(--color-green-700);
  }

  &.review {
    background-color: var(--color-yellow-100);
    color: var(--color-yellow-700);
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  margin: 0;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const ActivityTime = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-400);
`;

function RecentActivities({ orders, reviews }) {
  const activities = [];

  // Thêm activities từ orders
  if (orders?.orders) {
    orders.orders.forEach((order) => {
      activities.push({
        id: order._id,
        type: "booking",
        text: `New booking by ${order.account.name} - ${order.service[0]?.nameService}`,
        time: order.createdAt,
        icon: "📅",
      });
    });
  }

  // Thêm activities từ reviews (nếu có)
  if (reviews?.reviews) {
    reviews.reviews.forEach((review) => {
      activities.push({
        id: review._id,
        type: "review",
        text: `New review from ${review.account?.name} - ${review.rating}⭐`,
        time: review.createdAt,
        icon: "⭐",
      });
    });
  }

  // Sort by time (newest first)
  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <ActivityBox>
      <Heading as="h2">Recent Activities</Heading>
      <ActivityList>
        {activities.slice(0, 5).map((activity) => (
          <ActivityItem key={activity.id}>
            <ActivityIcon className={activity.type}>
              {activity.icon}
            </ActivityIcon>
            <ActivityContent>
              <ActivityText>{activity.text}</ActivityText>
              <ActivityTime>
                {format(new Date(activity.time), "MMM dd, HH:mm")}
              </ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>
    </ActivityBox>
  );
}

export default RecentActivities;
