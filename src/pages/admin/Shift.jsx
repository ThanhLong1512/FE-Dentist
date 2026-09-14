import { lazy, useState } from "react";
import styled from "styled-components";
import { Calendar, List } from "lucide-react";
import { useShifts } from "../../features/shift/useShifts";
import Spinner from "../../components/admin/Spinner";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const ShiftTable = lazy(() => import("../../features/shift/ShiftTable"));
const ShiftOperations = lazy(() =>
  import("../../features/shift/ShiftOperations")
);
const CreateShift = lazy(() => import("../../features/shift/CreateShift"));
const WeeklyScheduleGrid = lazy(() =>
  import("../../features/shift/WeeklyScheduleGrid")
);

const ViewToggleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--color-grey-0);
  padding: 0.4rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-sm);
`;

const ViewToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.4rem;
  border-radius: var(--border-radius-sm);
  border: none;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$active ? "var(--color-brand-gradient)" : "transparent"};
  color: ${(props) => (props.$active ? "#ffffff" : "var(--color-grey-600)")};
  box-shadow: ${(props) =>
    props.$active ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none"};

  &:hover:not(:disabled) {
    color: ${(props) => (props.$active ? "#ffffff" : "var(--color-brand-600)")};
  }
`;

function Shift() {
  const [viewMode, setViewMode] = useState("calendar");
  const { shifts = [], isLoading } = useShifts();

  return (
    <>
      <Row
        type="horizontal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.2rem",
          marginBottom: "0.8rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", flexWrap: "wrap" }}>
          <Heading as="h1">Ca trực bác sĩ (Shifts)</Heading>
          <ViewToggleBar>
            <ViewToggleButton
              type="button"
              $active={viewMode === "calendar"}
              onClick={() => setViewMode("calendar")}
            >
              <Calendar size={15} />
              <span>Lịch trực tuần</span>
            </ViewToggleButton>
            <ViewToggleButton
              type="button"
              $active={viewMode === "table"}
              onClick={() => setViewMode("table")}
            >
              <List size={15} />
              <span>Danh sách</span>
            </ViewToggleButton>
          </ViewToggleBar>
        </div>

        <CreateShift />
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        {isLoading ? (
          <Spinner />
        ) : viewMode === "calendar" ? (
          <WeeklyScheduleGrid shifts={shifts} />
        ) : (
          <>
            <ShiftOperations />
            <ShiftTable />
          </>
        )}
      </Row>
    </>
  );
}

export default Shift;
