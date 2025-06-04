function Patient() {
  return (
    <div className="admin-chat-input-form">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="admin-chat-input"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e);
          }
        }}
      />
      <button onClick={handleSendMessage} className="admin-send-btn">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}

export default Patient;
