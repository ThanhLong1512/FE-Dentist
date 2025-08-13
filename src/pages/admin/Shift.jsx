import Heading from "../../components/admin/Heading";
import Row from "../../components/admin/Row";
import ShiftTable from "../../features/shift/ShiftTable";
import ShiftOperations from "../../features/shift/ShiftOperations";
import CreateShift from "../../features/shift/CreateShift";
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
