import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const ShiftTable = lazy(() => import("../../features/shift/ShiftTable"));
const ShiftOperations = lazy(() =>
  import("../../features/shift/ShiftOperations")
);
const CreateShift = lazy(() => import("../../features/shift/CreateShift"));

function Shift() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Shift</Heading>
        <ShiftOperations />
      </Row>
      <Row>
        <ShiftTable />
        <CreateShift />
      </Row>
    </>
  );
}

export default Shift;
