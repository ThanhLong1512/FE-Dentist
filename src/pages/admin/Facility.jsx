import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const FacilityOperations = lazy(() =>
  import("../../features/facilities/FacilityOperations")
);
const FacilityTable = lazy(() =>
  import("../../features/facilities/FacilityTable")
);
const CreateFacility = lazy(() =>
  import("../../features/facilities/CreateFacility")
);

function Facility() {
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
        <Heading as="h1">Cơ sở phòng khám</Heading>
        <CreateFacility />
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <FacilityOperations />
        <FacilityTable />
      </Row>
    </>
  );
}

export default Facility;
