import { useState, useEffect, useRef } from "react";
import {
  handleCreateMessage,
  handleCreateConservation,
  handleGetMessagesByConservation,
} from "../apis";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [conservationId, setConservationId] = useState(null);
  const [isLoadingConservation, setIsLoadingConservation] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    setSocket(io(`${SOCKET_URL}`));
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setCurrentUserId(parsedUserInfo.id || parsedUserInfo._id);
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (conservationId) {
      fetchMessages();
    }
  }, [conservationId]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const response = await handleGetMessagesByConservation(conservationId);
      const formattedMessages = response.map((msg, index) => ({
        id: msg._id,
        text: msg.content,
        sender: msg.senderID === currentUserId ? "client" : "admin",
        senderID: msg.senderID,
        timestamp: formatTime(msg.createdAt),
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createConservation = async () => {
    try {
      setIsLoadingConservation(true);
      const response = await handleCreateConservation();
      setConservationId(response.conservation._id);
    } catch (error) {
      console.error("Error creating conservation:", error);
    } finally {
      setIsLoadingConservation(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || !conservationId) return;
    const tempMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "client",
      senderID: currentUserId,
      timestamp: formatTime(new Date()),
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");

    try {
      const messageData = {
        conservationID: conservationId,
        content: currentMessage,
      };

      const response = await handleCreateMessage(messageData);
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempMessage.id)
      );
    }
    setIsTyping(true);
    setTimeout(() => {
      const adminResponse = {
        id: Date.now() + 1,
        text: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
        sender: "admin",
        senderID: "admin",
        timestamp: formatTime(new Date()),
      };
      setMessages((prevMessages) => [...prevMessages, adminResponse]);
      setIsTyping(false);
    }, 20000);
  };

  const toggleChat = async () => {
    if (!isOpen && !conservationId) {
      await createConservation();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="chat-icon" onClick={toggleChat}>
        {isLoadingConservation ? (
          <div className="loading-spinner">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="4"
                strokeDasharray="32"
                strokeDashoffset="32"
              />
            </svg>
          </div>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
              fill="white"
            />
            <path d="M7 9H17V11H7V9Z" fill="white" />
            <path d="M7 12H13V14H7V12Z" fill="white" />
          </svg>
        )}
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>Hỗ trợ khách hàng</h4>
            <button className="close-btn" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="chat-messages">
            {isLoadingMessages ? (
              <div className="loading-messages">
                <div className="message admin-message">
                  <div className="message-content">
                    <p>Đang tải tin nhắn...</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender === "client"
                      ? "client-message"
                      : "admin-message"
                  }`}
                >
                  <div className="message-content">
                    <p style={{ color: "black" }}>{message.text}</p>
                    <span className="timestamp">{message.timestamp}</span>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="message admin-message">
                <div className="message-content typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                conservationId
                  ? "Nhập tin nhắn..."
                  : "Đang tạo cuộc trò chuyện..."
              }
              className="chat-input"
              disabled={!conservationId || isLoadingMessages}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={
                !conservationId ||
                inputMessage.trim() === "" ||
                isLoadingMessages
              }
            >
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
        </div>
      )}
    </>
  );
}

export default Chat;
