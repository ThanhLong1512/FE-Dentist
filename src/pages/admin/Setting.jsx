import { lazy } from "react";

const Heading = lazy(() => import("../../components/admin/Heading"));
const Row = lazy(() => import("../../components/admin/Row"));
const UpdateSettingsForm = lazy(() =>
  import("../../features/settings/UpdateSettingsForm")
);

function Setting() {
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
          marginBottom: "1.2rem",
        }}
      >
        <Heading as="h1">Cài đặt hệ thống</Heading>
      </Row>

      <Row style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <UpdateSettingsForm />
      </Row>
    </>
  );
}

export default Setting;
