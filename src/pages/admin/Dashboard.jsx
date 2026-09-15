import styled from "styled-components";
import DashboardHeader from "../../features/dashboard/DashboardHeader";
import DashboardLayout from "../../features/dashboard/DashboardLayout";
import ErrorBoundary from "../../components/ErrorBoundary";

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  width: 100%;
`;

function Dashboard() {
  return (
    <ErrorBoundary
      title="Không thể tải Bảng điều khiển"
      message="Đã xảy ra lỗi khi lấy dữ liệu phân tích số liệu của phòng khám. Vui lòng tải lại trang."
    >
      <DashboardWrapper>
        <DashboardHeader />
        <DashboardLayout />
      </DashboardWrapper>
    </ErrorBoundary>
  );
}

export default Dashboard;
