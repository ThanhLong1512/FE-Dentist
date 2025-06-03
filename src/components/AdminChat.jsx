import { useState, useEffect, useRef } from "react";

function AdminChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [users] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://via.placeholder.com/40/4CAF50/FFFFFF?text=A",
      lastMessage: "Tôi muốn hỏi về dịch vụ...",
      lastMessageTime: "2 phút trước",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://via.placeholder.com/40/2196F3/FFFFFF?text=B",
      lastMessage: "Cảm ơn bạn đã hỗ trợ",
      lastMessageTime: "5 phút trước",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "https://via.placeholder.com/40/FF9800/FFFFFF?text=C",
      lastMessage: "Bao giờ có thể giao hàng?",
      lastMessageTime: "10 phút trước",
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      avatar: "https://via.placeholder.com/40/E91E63/FFFFFF?text=D",
      lastMessage: "Giá cả như thế nào?",
      lastMessageTime: "15 phút trước",
      unreadCount: 3,
      isOnline: true,
    },
  ]);

  const [chatMessages, setChatMessages] = useState({
    1: [
      {
        id: 1,
        text: "Xin chào! Tôi muốn hỏi về dịch vụ của bạn",
        sender: "client",
        timestamp: "14:30",
      },
      {
        id: 2,
        text: "Chào bạn! Chúng tôi có thể hỗ trợ gì cho bạn?",
        sender: "admin",
        timestamp: "14:31",
      },
      {
        id: 3,
        text: "Tôi muốn biết về giá cả và thời gian thực hiện",
        sender: "client",
        timestamp: "14:32",
      },
    ],
    2: [
      {
        id: 1,
        text: "Cảm ơn bạn đã hỗ trợ tôi hôm qua",
        sender: "client",
        timestamp: "13:45",
      },
      {
        id: 2,
        text: "Không có gì! Rất vui được hỗ trợ bạn",
        sender: "admin",
        timestamp: "13:46",
      },
    ],
    3: [
      {
        id: 1,
        text: "Bao giờ có thể giao hàng cho tôi?",
        sender: "client",
        timestamp: "12:30",
      },
    ],
    4: [
      {
        id: 1,
        text: "Giá cả của dịch vụ này như thế nào?",
        sender: "client",
        timestamp: "11:45",
      },
      {
        id: 2,
        text: "Bạn có thể xem bảng giá tại đây...",
        sender: "admin",
        timestamp: "11:50",
      },
      {
        id: 3,
        text: "Có thể giảm giá không?",
        sender: "client",
        timestamp: "11:55",
      },
    ],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedUser) {
      scrollToBottom();
    }
  }, [chatMessages, selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "admin",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    }));

    setInputMessage("");
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBackToUserList = () => {
    setSelectedUser(null);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedUser(null);
    }
  };

  const getTotalUnreadCount = () => {
    return users.reduce((total, user) => total + user.unreadCount, 0);
  };

  return (
    <>
      {/* Admin Chat Icon */}
      <div className="admin-chat-icon" onClick={toggleChat}>
        {getTotalUnreadCount() > 0 && (
          <span className="admin-unread-badge">{getTotalUnreadCount()}</span>
        )}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.28L2 22L7.72 20.99C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.74 20 9.54 19.75 8.46 19.3L6.5 19.85L7.05 17.54C6.25 16.46 6 15.26 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z"
            fill="white"
          />
          <circle cx="9" cy="12" r="1" fill="white" />
          <circle cx="12" cy="12" r="1" fill="white" />
          <circle cx="15" cy="12" r="1" fill="white" />
        </svg>
      </div>

      {/* Admin Chat Window */}
      {isOpen && (
        <div className="admin-chat-window">
          {!selectedUser ? (
            // User List View
            <>
              <div className="admin-chat-header">
                <h4>Tin nhắn từ khách hàng</h4>
                <button className="close-btn" onClick={toggleChat}>
                  ×
                </button>
              </div>

              <div className="admin-users-list">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="admin-user-item"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="admin-user-avatar">
                      <img src={user.avatar} alt={user.name} />
                      {user.isOnline && <span className="online-dot"></span>}
                    </div>
                    <div className="admin-user-info">
                      <div className="admin-user-name">{user.name}</div>
                      <div className="admin-last-message">
                        {user.lastMessage}
                      </div>
                      <div className="admin-last-time">
                        {user.lastMessageTime}
                      </div>
                    </div>
                    {user.unreadCount > 0 && (
                      <span className="admin-unread-count">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Chat View
            <>
              <div className="admin-chat-header">
                <button className="back-btn" onClick={handleBackToUserList}>
                  ←
                </button>
                <div className="admin-chat-user-info">
                  <img src={selectedUser.avatar} alt={selectedUser.name} />
                  <div>
                    <div className="admin-chat-user-name">
                      {selectedUser.name}
                    </div>
                    <div className="admin-chat-user-status">
                      {selectedUser.isOnline ? "Đang online" : "Offline"}
                    </div>
                  </div>
                </div>
                <button className="close-btn" onClick={toggleChat}>
                  ×
                </button>
              </div>

              <div className="admin-chat-messages">
                {(chatMessages[selectedUser.id] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`admin-message ${
                      message.sender === "admin"
                        ? "admin-message-sent"
                        : "admin-message-received"
                    }`}
                  >
                    <div className="admin-message-content">
                      <p>{message.text}</p>
                      <span className="admin-timestamp">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="admin-message admin-message-received">
                    <div className="admin-message-content typing">
                      <div className="admin-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="admin-chat-input-form"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="admin-chat-input"
                />
                <button type="submit" className="admin-send-btn">
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
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default AdminChat;
