import { useState, useEffect, useRef } from "react";
import {
  handleGetMyConservation,
  handleGetMessagesByConservation,
  handleCreateMessage,
} from "../apis";
import { set } from "date-fns";

function AdminChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConservation, setSelectedConservation] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [conservations, setConservations] = useState([]);
  const [chatMessages, setChatMessages] = useState({});

  const fetchConversations = async () => {
    try {
      const data = await handleGetMyConservation();
      const userList = data.conservation.map((item) => item.member[0]);
      setUsers(userList);
      setConservations(data.conservation);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchMessages = async (conservationId) => {
    try {
      const data = await handleGetMessagesByConservation(conservationId);
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedUser) {
      scrollToBottom();
    }
  }, [chatMessages, selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || !selectedUser) return;
    const data = {
      content: inputMessage,
      conservationID: selectedConservation._id,
    };
    try {
      const newMessage = await handleCreateMessage(data);
      const formattedMessage = {
        id: newMessage._id,
        text: newMessage.content,
        sender: newMessage.senderID === selectedUser._id ? "user" : "admin",
        timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), formattedMessage],
      }));
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleUserSelect = async (user) => {
    const conservation = conservations.find((cons) =>
      cons.member.some((member) => member._id === user._id)
    );
    if (conservation) {
      setSelectedConservation(conservation);
      setSelectedUser(user);
      const messages = await fetchMessages(conservation._id);
      const formattedMessages = messages.map((message) => ({
        id: message._id,
        text: message.content,
        sender: message.senderID === user._id ? "user" : "admin",
        timestamp: new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setChatMessages((prev) => ({
        ...prev,
        [user.id]: formattedMessages,
      }));
    }
  };

  const handleBackToUserList = () => {
    setSelectedUser(null);
    setSelectedConservation(null);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedUser(null);
      setSelectedConservation(null);
    }
  };

  return (
    <>
      <div className="admin-chat-icon" onClick={toggleChat}>
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

      {isOpen && (
        <div className="admin-chat-window">
          {!selectedUser ? (
            <>
              <div className="admin-chat-header">
                <h4>Tin nhắn từ khách hàng</h4>
                <button className="close-btn" onClick={toggleChat}>
                  ×
                </button>
              </div>

              <div className="admin-users-list">
                {users.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#666",
                    }}
                  >
                    Đang tải danh sách cuộc trò chuyện...
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="admin-user-item"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="admin-user-avatar">
                        <img src={user.photo} alt={user.name} />
                        {user.isOnline && <span className="online-dot"></span>}
                      </div>
                      <div className="admin-user-info">
                        <div className="admin-user-name">{user.name}</div>
                      </div>
                      <div className="admin-user-info">
                        <div className="admin-user-name">{user.email}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="admin-chat-header">
                <button className="back-btn" onClick={handleBackToUserList}>
                  ←
                </button>
                <div className="admin-chat-user-info">
                  <img src={selectedUser.photo} alt={selectedUser.name} />
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
                {(chatMessages[selectedUser.id] || []).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#666",
                    }}
                  >
                    Chưa có tin nhắn nào
                  </div>
                ) : (
                  (chatMessages[selectedUser.id] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`admin-message ${
                        message.sender === "admin"
                          ? "admin-message-sent"
                          : "admin-message-received"
                      }`}
                    >
                      <div className="admin-message-content">
                        <p style={{ color: "black" }}>{message.text}</p>
                        <span className="admin-timestamp">
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}

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
            </>
          )}
        </div>
      )}
    </>
  );
}

export default AdminChat;
