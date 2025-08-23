import { useState, useEffect, useRef } from "react";
import {
  handleGetMyConservation,
  handleGetMessagesByConservation,
  handleCreateMessage,
} from "../../apis";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../utils/constants";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const typing = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const StyledChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    bottom: 15px;
    right: 80px;
    width: 50px;
    height: 50px;
  }
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3838;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  animation: ${pulse} 2s infinite;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 80px;
  right: 70px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 999;
  animation: ${slideUp} 0.3s ease-out;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    height: 500px;
    right: 20px;
    left: 20px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.2s;
  margin-right: 10px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ChatUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 2px solid white;
  }
`;

const ChatUserName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const ChatUserStatus = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

const UsersList = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
  position: relative;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.div`
  position: relative;
  margin-right: 12px;

  img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
`;

const OnlineDot = styled.span`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LastTime = styled.div`
  font-size: 11px;
  color: #999;
`;

const UnreadCount = styled.div`
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  margin-left: 10px;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  max-height: calc(600px - 140px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

const Message = styled.div`
  margin-bottom: 15px;
  display: flex;

  &.sent {
    justify-content: flex-end;
  }

  &.received {
    justify-content: flex-start;
  }
`;

const MessageContent = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;

  &.sent {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-bottom-right-radius: 4px;
  }

  &.received {
    background: #f1f3f5;
    color: #333;
    border-bottom-left-radius: 4px;
  }

  &.typing {
    padding: 12px 16px !important;
  }

  p {
    margin: 0 0 5px 0;
    line-height: 1.4;
    font-size: 14px;
  }
`;

const Timestamp = styled.span`
  font-size: 11px;
  opacity: 0.7;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;

  span {
    height: 8px;
    width: 8px;
    background: #999;
    border-radius: 50%;
    animation: ${typing} 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
`;

const ChatInputForm = styled.div`
  padding: 15px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
  color: black;

  &:focus {
    border-color: #ff6b6b;
  }
`;

const SendBtn = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

function AdminChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConservation, setSelectedConservation] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const [users, setUsers] = useState([]);
  const [conservations, setConservations] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const safeGetUserProperty = (user, property, fallback = "") => {
    if (!user) return fallback;
    return user[property] || fallback;
  };

  const fetchConversations = async () => {
    try {
      const data = await handleGetMyConservation();
      if (data && data.conservation) {
        const userList = data.conservation
          .map((item) => item.member[0])
          .filter((user) => user);
        setUsers(userList);
        setConservations(data.conservation);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setCurrentUserId(parsedUserInfo.id);
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
      }
    }

    if (SOCKET_URL) {
      socket.current = io(`${SOCKET_URL}`);
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUserId && socket.current) {
      socket.current.emit("addUser", currentUserId);

      socket.current.on("getMessage", ({ senderID, text }) => {
        const senderUser = users.find(
          (user) => (user?._id || user?.id) === senderID
        );
        if (senderUser) {
          const newMessage = {
            id: Date.now(),
            text: text,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          const userKey = senderUser.id || senderUser._id;
          setChatMessages((prev) => ({
            ...prev,
            [userKey]: [...(prev[userKey] || []), newMessage],
          }));
        }
      });
    }
    return () => {
      if (socket.current) {
        socket.current.off("getUsers");
        socket.current.off("getMessage");
      }
    };
  }, [currentUserId, users]);

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
    if (inputMessage.trim() === "" || !selectedUser || !currentUserId) return;

    const tempMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "admin",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (socket.current && currentUserId) {
      socket.current.emit("sendMessage", {
        senderID: currentUserId,
        receiverID: selectedUser._id || selectedUser.id,
        text: inputMessage,
      });
    }

    const userKey = selectedUser.id || selectedUser._id;
    setChatMessages((prev) => ({
      ...prev,
      [userKey]: [...(prev[userKey] || []), tempMessage],
    }));

    const currentMessage = inputMessage;
    setInputMessage("");

    const data = {
      content: currentMessage,
      conservationID: selectedConservation._id,
    };

    try {
      const newMessage = await handleCreateMessage(data);

      setChatMessages((prev) => ({
        ...prev,
        [userKey]: prev[userKey].map((msg) =>
          msg.id === tempMessage.id ? { ...msg, id: newMessage._id } : msg
        ),
      }));
    } catch (error) {
      console.error("Error sending message", error);

      setChatMessages((prev) => ({
        ...prev,
        [userKey]: prev[userKey].filter((msg) => msg.id !== tempMessage.id),
      }));
    }
  };

  const handleUserSelect = async (user) => {
    const conservation = conservations.find(
      (cons) =>
        cons.member &&
        cons.member.some(
          (member) => (member._id || member.id) === (user._id || user.id)
        )
    );
    if (conservation) {
      setSelectedConservation(conservation);
      setSelectedUser(user);
      const messages = await fetchMessages(conservation._id);
      const formattedMessages = messages.map((message) => ({
        id: message._id,
        text: message.content,
        sender: message.senderID === (user._id || user.id) ? "user" : "admin",
        timestamp: new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      const userKey = user.id || user._id;
      setChatMessages((prev) => ({
        ...prev,
        [userKey]: formattedMessages,
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
      <StyledChatContainer onClick={toggleChat}>
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
      </StyledChatContainer>

      {isOpen && (
        <ChatWindow>
          {!selectedUser ? (
            <>
              <ChatHeader>
                <h4>Tin nhắn từ khách hàng</h4>
                <CloseBtn onClick={toggleChat}>×</CloseBtn>
              </ChatHeader>

              <UsersList>
                {users.length === 0 ? (
                  <LoadingMessage>
                    Đang tải danh sách cuộc trò chuyện...
                  </LoadingMessage>
                ) : (
                  users.map((user, index) => {
                    if (!user) return null;

                    const userKey = user.id || user._id || index;
                    const userName = safeGetUserProperty(
                      user,
                      "name",
                      "Unknown User"
                    );
                    const userEmail = safeGetUserProperty(
                      user,
                      "email",
                      "No email"
                    );

                    return (
                      <UserItem
                        key={userKey}
                        onClick={() => handleUserSelect(user)}
                      >
                        <UserAvatar>
                          <img
                            src={user?.photo}
                            alt={userName}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/40x40/cccccc/ffffff?text=U";
                            }}
                          />
                          {user?.isOnline && <OnlineDot />}
                        </UserAvatar>
                        <UserInfo>
                          <UserName>{userName}</UserName>
                          <UserName>{userEmail}</UserName>
                        </UserInfo>
                      </UserItem>
                    );
                  })
                )}
              </UsersList>
            </>
          ) : (
            <>
              <ChatHeader>
                <BackBtn onClick={handleBackToUserList}>←</BackBtn>
                <ChatUserInfo>
                  <img
                    src={selectedUser?.photo}
                    alt={safeGetUserProperty(
                      selectedUser,
                      "name",
                      "Unknown User"
                    )}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/40x40/cccccc/ffffff?text=U";
                    }}
                  />
                  <div>
                    <ChatUserName>
                      {safeGetUserProperty(
                        selectedUser,
                        "name",
                        "Unknown User"
                      )}
                    </ChatUserName>
                    <ChatUserStatus>
                      {selectedUser ? "Online" : "Offline"}
                    </ChatUserStatus>
                  </div>
                </ChatUserInfo>
                <CloseBtn onClick={toggleChat}>×</CloseBtn>
              </ChatHeader>

              <ChatMessages>
                {(() => {
                  const userKey = selectedUser.id || selectedUser._id;
                  const messages = chatMessages[userKey] || [];

                  return messages.length === 0 ? (
                    <LoadingMessage>Chưa có tin nhắn nào</LoadingMessage>
                  ) : (
                    messages.map((message) => (
                      <Message
                        key={message.id}
                        className={
                          message.sender === "admin" ? "sent" : "received"
                        }
                      >
                        <MessageContent
                          className={
                            message.sender === "admin" ? "sent" : "received"
                          }
                        >
                          <p
                            style={{
                              color:
                                message.sender === "admin" ? "white" : "black",
                            }}
                          >
                            {message.text}
                          </p>
                          <Timestamp>{message.timestamp}</Timestamp>
                        </MessageContent>
                      </Message>
                    ))
                  );
                })()}

                {isTyping && (
                  <Message className="received">
                    <MessageContent className="received typing">
                      <TypingIndicator>
                        <span></span>
                        <span></span>
                        <span></span>
                      </TypingIndicator>
                    </MessageContent>
                  </Message>
                )}
                <div ref={messagesEndRef} />
              </ChatMessages>

              <ChatInputForm>
                <ChatInput
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  disabled={!currentUserId}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(e);
                    }
                  }}
                />
                <SendBtn
                  onClick={handleSendMessage}
                  disabled={!currentUserId || inputMessage.trim() === ""}
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
                </SendBtn>
              </ChatInputForm>
            </>
          )}
        </ChatWindow>
      )}
    </>
  );
}

export default AdminChat;
