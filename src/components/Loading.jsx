function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        src="/images/loading/loading.svg"
        alt="Loading spinner"
        style={{ width: "100px", height: "100px" }}
      />
    </div>
  );
}

export default Loading;
