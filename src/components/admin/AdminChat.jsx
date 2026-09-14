import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { io } from "socket.io-client";
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Image as ImageIcon,
  Search,
  Sparkles,
  Phone,
  Mail,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronDown,
  ArrowLeft,
  Users,
} from "lucide-react";
import {
  handleGetMyConservation,
  handleGetMessagesByConservation,
  handleCreateMessage,
  handleUploadChatMedia,
} from "../../apis";
import { SOCKET_URL } from "../../utils/constants";
import toast from "react-hot-toast";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// Trigger Button
const TriggerButton = styled.button`
  position: fixed;
  bottom: 2.8rem;
  right: 2.8rem;
  width: 5.8rem;
  height: 5.8rem;
  border-radius: 50%;
  background: var(--color-brand-gradient);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 25px -4px rgba(2, 132, 199, 0.45);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${floatAnimation} 4s ease-in-out infinite;

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 14px 30px -4px rgba(2, 132, 199, 0.55);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  min-width: 2.2rem;
  height: 2.2rem;
  padding: 0 0.4rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-grey-0);
  animation: ${pulseAnimation} 2s infinite ease-in-out;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
`;

// Chat Modal Window
const ChatContainer = styled.div`
  position: fixed;
  bottom: 2.4rem;
  right: 2.4rem;
  width: min(88rem, calc(100vw - 3.2rem));
  height: min(62rem, calc(100vh - 4.8rem));
  background: var(--color-grey-0);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--color-grey-200);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  overflow: hidden;
  z-index: 1000;
  animation: ${popIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 860px) {
    width: calc(100vw - 2rem);
    height: calc(100vh - 3rem);
    bottom: 1rem;
    right: 1rem;
    border-radius: var(--border-radius-lg);
  }
`;

// Left Sidebar: Conversations
const ConvSidebar = styled.div`
  width: 32rem;
  min-width: 28rem;
  background: var(--color-grey-50);
  border-right: 1px solid var(--color-grey-200);
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 860px) {
    width: 100%;
    min-width: 0;
    border-right: none;
    display: ${(props) => (props.$hasActive ? "none" : "flex")};
  }
`;

const ConvSidebarHeader = styled.div`
  padding: 1.8rem 1.6rem 1.2rem;
  border-bottom: 1px solid var(--color-grey-200);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ConvHeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-800);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  button {
    background: transparent;
    border: none;
    color: var(--color-grey-400);
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      color: var(--color-brand-600);
      background: var(--color-grey-200);
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 1rem;
    color: var(--color-grey-400);
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3.4rem;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-grey-200);
    background: var(--color-grey-0);
    font-size: 1.3rem;
    color: var(--color-grey-800);
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: var(--color-brand-500);
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }

    &::placeholder {
      color: var(--color-grey-400);
    }
  }
`;

const ConvList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-200);
    border-radius: 3px;
  }
`;

const ConvItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$active ? "var(--color-brand-50)" : "transparent"};
  border-left: 3px solid
    ${(props) => (props.$active ? "var(--color-brand-600)" : "transparent")};

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--color-brand-50)" : "var(--color-grey-100)"};
  }
`;

const ConvAvatarWrapper = styled.div`
  position: relative;
  width: 4.4rem;
  height: 4.4rem;
  flex-shrink: 0;
`;

const ConvAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-grey-200);
`;

const ConvDefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--color-brand-gradient);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
`;

const OnlineDot = styled.span`
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--color-grey-0);
`;

const ConvInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ConvInfoTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .name {
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--color-grey-800);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .time {
    font-size: 1.1rem;
    color: var(--color-grey-400);
    flex-shrink: 0;
  }
`;

const ConvSnippet = styled.div`
  font-size: 1.25rem;
  color: var(--color-grey-500);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &.unread {
    font-weight: 700;
    color: var(--color-brand-700);
  }
`;

// Right Column: Active Chat Area
const ChatArea = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-grey-0);
  overflow: hidden;

  @media (max-width: 860px) {
    width: 100%;
    display: ${(props) => (props.$hasActive ? "flex" : "none")};
  }
`;

const ChatHeader = styled.div`
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-grey-0);
  z-index: 10;
  gap: 1rem;
  flex-shrink: 0;
  min-width: 0;
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
  flex: 1;
`;

const BackToListButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.1rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-100);
  color: var(--color-grey-800);
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: var(--color-brand-50);
    color: var(--color-brand-600);
    border-color: var(--color-brand-300);
    transform: translateX(-1px);
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const CloseIconButton = styled.button`
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-100);
  color: var(--color-grey-700);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
    transform: scale(1.06);
  }

  svg {
    width: 1.7rem;
    height: 1.7rem;
  }
`;

const ChatBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 999;
  backdrop-filter: blur(3px);
`;

const ConvHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  .refresh-btn {
    background: transparent;
    border: 1px solid var(--color-grey-200);
    color: var(--color-grey-500);
    cursor: pointer;
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      color: var(--color-brand-600);
      background: var(--color-grey-100);
      border-color: var(--color-brand-300);
    }
  }
`;

const PatientHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-width: 0;
  flex: 1;

  .details {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .name-row {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .name {
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--color-grey-800);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .role-badge {
      font-size: 1.05rem;
      font-weight: 600;
      padding: 0.15rem 0.6rem;
      border-radius: 4px;
      line-height: 1.3;
      flex-shrink: 0;

      &.customer {
        background: var(--color-brand-100);
        color: var(--color-brand-700);
      }
      &.internal {
        background: var(--color-yellow-100);
        color: var(--color-yellow-700);
      }
    }

    .meta {
      font-size: 1.2rem;
      color: var(--color-grey-400);
      display: flex;
      align-items: center;
      gap: 1.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
    }
  }
`;

const ChatHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  background: var(--color-grey-50);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 3px;
  }
`;

const DateDivider = styled.div`
  align-self: center;
  font-size: 1.15rem;
  color: var(--color-grey-400);
  background: var(--color-grey-200);
  padding: 0.3rem 1.2rem;
  border-radius: var(--border-radius-full);
  font-weight: 500;
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isMe ? "flex-end" : "flex-start")};
  gap: 0.4rem;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 1.2rem 1.6rem;
  font-size: 1.4rem;
  line-height: 1.45;
  border-radius: 1.6rem;
  word-break: break-word;

  ${(props) =>
    props.$isMe
      ? css`
          background: var(--color-brand-gradient);
          color: #ffffff;
          border-bottom-right-radius: 0.4rem;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
        `
      : css`
          background: var(--color-grey-0);
          color: var(--color-grey-800);
          border-bottom-left-radius: 0.4rem;
          border: 1px solid var(--color-grey-200);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        `}
`;

const MessageImage = styled.img`
  max-width: 26rem;
  max-height: 22rem;
  border-radius: 1.2rem;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const MessageTimestamp = styled.span`
  font-size: 1.1rem;
  color: var(--color-grey-400);
  padding: 0 0.4rem;
`;

// Quick Responses Chips Bar
const QuickBar = styled.div`
  padding: 0.8rem 1.6rem;
  background: var(--color-grey-0);
  border-top: 1px solid var(--color-grey-100);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  overflow-x: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const QuickChip = styled.button`
  background: var(--color-grey-100);
  border: 1px solid var(--color-grey-200);
  color: var(--color-grey-700);
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: var(--color-brand-50);
    color: var(--color-brand-700);
    border-color: var(--color-brand-300);
  }
`;

// Input Form
const InputArea = styled.form`
  padding: 1.2rem 1.6rem;
  border-top: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AttachButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-grey-400);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    color: var(--color-brand-600);
    background: var(--color-grey-100);
  }
`;

const TextInput = styled.input`
  flex: 1;
  padding: 1rem 1.4rem;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-50);
  font-size: 1.4rem;
  color: var(--color-grey-800);
  outline: none;
  transition: all 0.2s;

  &:focus {
    background: var(--color-grey-0);
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

const SendButton = styled.button`
  width: 4.2rem;
  height: 4.2rem;
  border-radius: 50%;
  background: var(--color-brand-gradient);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Empty State Placeholder
const EmptyArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  color: var(--color-grey-400);
  padding: 4rem;
  text-align: center;

  svg {
    width: 6.4rem;
    height: 6.4rem;
    color: var(--color-grey-300);
  }

  h4 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-grey-600);
    margin: 0;
  }

  p {
    font-size: 1.35rem;
    max-width: 32rem;
    margin: 0;
  }
`;

// Image Lightbox Modal
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;

  img {
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    object-fit: contain;
  }
`;

const QUICK_RESPONSES = [
  "Chào bạn! Cheese Dental có thể hỗ trợ gì cho bạn ạ?",
  "Dạ bạn muốn đặt lịch khám vào thời gian nào ạ?",
  "Dạ chi phí dịch vụ bên mình đang có ưu đãi 20% ạ!",
  "Bác sĩ chuyên khoa đang kiểm tra hồ sơ và sẽ phản hồi ngay ạ.",
  "Dạ cảm ơn bạn đã quan tâm đến phòng khám Cheese Dental!",
];

// Synthetic Audio Chime for incoming messages
const playIncomingChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (e) {
    // Audio restriction ignored
  }
};

function AdminChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [inputText, setInputText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeConvRef = useRef(null);

  // Keep activeConvRef in sync for socket callback
  useEffect(() => {
    activeConvRef.current = activeConv;
  }, [activeConv]);

  const currentUserId = useMemo(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        const u = JSON.parse(stored);
        return u.id || u._id || "";
      }
    } catch (e) {}
    return "";
  }, []);

  // Fetch all conversations from backend
  const fetchConversations = useCallback(async (autoSelectFirst = false) => {
    try {
      const res = await handleGetMyConservation();
      const list = res?.conservation || [];
      setConversations(list);

      // Only auto select if explicitly asked and on large desktop
      if (list.length > 0 && autoSelectFirst && window.innerWidth > 860) {
        setActiveConv((prev) => prev || list[0]);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConv?._id) {
      setMessages([]);
      return;
    }

    let isSubscribed = true;
    const loadMessages = async () => {
      try {
        const msgs = await handleGetMessagesByConservation(activeConv._id);
        if (isSubscribed) {
          setMessages(msgs || []);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();
    return () => {
      isSubscribed = false;
    };
  }, [activeConv?._id]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Socket.IO lifecycle
  useEffect(() => {
    if (!SOCKET_URL) return;

    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = s;

    s.on("connect", () => {
      console.log("AdminChat connected to socket:", s.id);
      if (currentUserId) {
        s.emit("addUser", { userID: currentUserId, role: "admin" });
        s.emit("joinDashboard", { role: "admin" });
      }
    });

    const handleIncomingMessage = (msg) => {
      playIncomingChime();

      // Check if message belongs to current open conversation
      const currentActive = activeConvRef.current;
      const isCurrent =
        currentActive &&
        (msg.conservationID === currentActive._id ||
          msg.senderID === currentActive.otherMember?._id);

      if (isCurrent) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setUnreadTotal((prev) => prev + 1);
        toast(`Tin nhắn mới từ ${msg.senderName || "Khách hàng"}`, {
          icon: "💬",
        });
      }

      // Refresh conversation preview list
      fetchConversations();
    };

    s.on("getMessage", handleIncomingMessage);
    s.on("admin:chat:incoming", handleIncomingMessage);

    return () => {
      s.disconnect();
    };
  }, [currentUserId, fetchConversations]);

  // Initial load
  useEffect(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  // Helper to extract customer details
  const getCustomer = (conv) => {
    if (!conv) return null;
    const members = (conv.member || []).filter(Boolean);

    // 1. Find member that is NOT current user and NOT admin
    const customer = members.find(
      (m) =>
        (m._id || m.id)?.toString() !== currentUserId?.toString() &&
        m.role !== "admin" &&
        m.email !== "admin@gmail.com"
    );
    if (customer) return customer;

    // 2. conv.otherMember if not admin
    if (
      conv.otherMember &&
      conv.otherMember.role !== "admin" &&
      conv.otherMember.email !== "admin@gmail.com"
    ) {
      return conv.otherMember;
    }

    // 3. Other member with different ID
    const other = members.find(
      (m) => (m._id || m.id)?.toString() !== currentUserId?.toString()
    );
    if (other) return other;

    // 4. Fallback if self-chat
    const first = members[0];
    if (first) {
      return {
        ...first,
        isInternal: true,
      };
    }

    return {
      name: "Khách hàng",
      email: "",
      role: "user",
    };
  };

  // Filtered conversation list
  const filteredConversations = useMemo(() => {
    if (!searchText.trim()) return conversations;
    const q = searchText.toLowerCase();
    return conversations.filter((conv) => {
      const customer = getCustomer(conv);
      const name = customer?.name?.toLowerCase() || "";
      const email = customer?.email?.toLowerCase() || "";
      const phone = customer?.phone?.toLowerCase() || "";
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [conversations, searchText, currentUserId]);

  // Send text or media message
  const sendMessage = async (content, messageType = "text", mediaUrl = "") => {
    if (!activeConv?._id) return;
    const customer = getCustomer(activeConv);
    const receiverID = customer?._id || customer?.id;

    const payload = {
      conservationID: activeConv._id,
      senderID: currentUserId,
      content: content || "",
      messageType,
      mediaUrl: mediaUrl || "",
    };

    // Optimistic message update
    const optimisticMsg = {
      ...payload,
      _id: "opt_" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await handleCreateMessage(payload);

      // Emit via socket
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          ...payload,
          receiverID,
          text: content,
        });
      }

      // Refresh conversations list to update preview
      fetchConversations();
    } catch (err) {
      console.error("Error creating message:", err);
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại!");
    }
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText("");
    sendMessage(textToSend, "text");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ chọn tệp hình ảnh!");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Dung lượng ảnh tối đa 8MB!");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await handleUploadChatMedia(formData);
      if (res?.url) {
        await sendMessage("", "image", res.url);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Tải ảnh thất bại!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const activeCustomer = getCustomer(activeConv);

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <TriggerButton
          onClick={() => {
            setIsOpen(true);
            setUnreadTotal(0);
            fetchConversations(true);
          }}
          title="Mở kênh chat hỗ trợ khách hàng"
        >
          <MessageCircle size={28} />
          {unreadTotal > 0 && <UnreadBadge>{unreadTotal}</UnreadBadge>}
        </TriggerButton>
      )}

      {/* Main Chat Modal */}
      {isOpen && (
        <>
          <ChatBackdrop onClick={() => setIsOpen(false)} />
          <ChatContainer>
            {/* Left Sidebar */}
            <ConvSidebar $hasActive={Boolean(activeConv)}>
              <ConvSidebarHeader>
                <ConvHeaderTop>
                  <h3>
                    <MessageCircle size={18} color="var(--color-brand-600)" />
                    Hộp thoại Khách hàng ({conversations.length})
                  </h3>
                  <ConvHeaderActions>
                    <button
                      className="refresh-btn"
                      onClick={() => fetchConversations(true)}
                      title="Làm mới danh sách"
                    >
                      <RefreshCw size={15} />
                    </button>
                    <CloseIconButton
                      onClick={() => setIsOpen(false)}
                      title="Đóng chatbox"
                    >
                      <X size={17} />
                    </CloseIconButton>
                  </ConvHeaderActions>
                </ConvHeaderTop>

                <SearchBox>
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Tìm tên, email, sđt..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </SearchBox>
              </ConvSidebarHeader>

              <ConvList>
                {filteredConversations.length === 0 ? (
                  <div
                    style={{
                      padding: "3rem 1.6rem",
                      textAlign: "center",
                      color: "var(--color-grey-400)",
                      fontSize: "1.3rem",
                    }}
                  >
                    Không tìm thấy cuộc trò chuyện nào
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const customer = getCustomer(conv);
                    const isActive = activeConv?._id === conv._id;
                    const lastMsg = conv.lastMessage;
                    const name = customer?.name || "Khách hàng";
                    const initial = name.slice(0, 1).toUpperCase();
                    const time = lastMsg?.createdAt
                      ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";

                    return (
                      <ConvItem
                        key={conv._id}
                        $active={isActive}
                        onClick={() => setActiveConv(conv)}
                      >
                        <ConvAvatarWrapper>
                          {customer?.photo ? (
                            <ConvAvatar src={customer.photo} alt={name} />
                          ) : (
                            <ConvDefaultAvatar>{initial}</ConvDefaultAvatar>
                          )}
                          <OnlineDot />
                        </ConvAvatarWrapper>

                        <ConvInfo>
                          <ConvInfoTop>
                            <span className="name">{name}</span>
                            <span className="time">{time}</span>
                          </ConvInfoTop>
                          <ConvSnippet>
                            {lastMsg?.messageType === "image" ? (
                              <span>📷 [Hình ảnh]</span>
                            ) : (
                              lastMsg?.content || "Bắt đầu cuộc trò chuyện..."
                            )}
                          </ConvSnippet>
                        </ConvInfo>
                      </ConvItem>
                    );
                  })
                )}
              </ConvList>
            </ConvSidebar>

            {/* Right Chat Area */}
            <ChatArea $hasActive={Boolean(activeConv)}>
              <ChatHeader>
                <ChatHeaderLeft>
                  {activeConv && (
                    <BackToListButton
                      type="button"
                      onClick={() => setActiveConv(null)}
                      title="Quay lại danh sách khách hàng"
                    >
                      <ArrowLeft size={16} />
                      <span>Danh sách</span>
                    </BackToListButton>
                  )}

                  {activeConv ? (
                    <PatientHeaderInfo>
                      <ConvAvatarWrapper style={{ width: "4rem", height: "4rem" }}>
                        {activeCustomer?.photo ? (
                          <ConvAvatar
                            src={activeCustomer.photo}
                            alt={activeCustomer.name}
                          />
                        ) : (
                          <ConvDefaultAvatar style={{ fontSize: "1.3rem" }}>
                            {(activeCustomer?.name || "K")[0].toUpperCase()}
                          </ConvDefaultAvatar>
                        )}
                        <OnlineDot />
                      </ConvAvatarWrapper>

                      <div className="details">
                        <div className="name-row">
                          <span className="name">
                            {activeCustomer?.name || "Khách hàng"}
                          </span>
                          {activeCustomer?.isInternal || activeCustomer?.role === "admin" ? (
                            <span className="role-badge internal">Nội bộ / Admin</span>
                          ) : (
                            <span className="role-badge customer">Khách hàng</span>
                          )}
                        </div>
                        <div className="meta">
                          {activeCustomer?.phone && (
                            <span>
                              <Phone size={11} />
                              {activeCustomer.phone}
                            </span>
                          )}
                          {activeCustomer?.email && (
                            <span>
                              <Mail size={11} />
                              {activeCustomer.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </PatientHeaderInfo>
                  ) : (
                    <PatientHeaderInfo>
                      <div className="details">
                        <span className="name">Tư vấn trực tuyến</span>
                        <span style={{ fontSize: "1.2rem", color: "var(--color-grey-400)" }}>
                          Kênh chăm sóc và hỗ trợ khách hàng Cheese Dental
                        </span>
                      </div>
                    </PatientHeaderInfo>
                  )}
                </ChatHeaderLeft>

                <ChatHeaderActions>
                  <CloseIconButton
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Đóng kênh chat"
                  >
                    <X size={18} />
                  </CloseIconButton>
                </ChatHeaderActions>
              </ChatHeader>

              {activeConv ? (
                <>
                  {/* Message Stream */}
                  <MessageList>
                    <DateDivider>Hộp thoại tư vấn trực tuyến</DateDivider>

                    {messages.map((msg, idx) => {
                      const senderObjId =
                        typeof msg.senderID === "object"
                          ? msg.senderID?._id
                          : msg.senderID;
                      const isMe =
                        senderObjId?.toString() === currentUserId.toString();
                      const time = msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "";

                      return (
                        <MessageRow key={msg._id || idx} $isMe={isMe}>
                          <MessageBubble $isMe={isMe}>
                            {msg.messageType === "image" || msg.mediaUrl ? (
                              <MessageImage
                                src={msg.mediaUrl}
                                alt="Đính kèm"
                                onClick={() => setLightboxImg(msg.mediaUrl)}
                              />
                            ) : (
                              msg.content || msg.text
                            )}
                          </MessageBubble>
                          <MessageTimestamp>{time}</MessageTimestamp>
                        </MessageRow>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </MessageList>

                  {/* Quick Response Chips */}
                  <QuickBar>
                    <Sparkles size={14} color="var(--color-brand-600)" />
                    {QUICK_RESPONSES.map((chip, i) => (
                      <QuickChip
                        key={i}
                        type="button"
                        onClick={() => setInputText(chip)}
                      >
                        {chip}
                      </QuickChip>
                    ))}
                  </QuickBar>

                  {/* Input Area */}
                  <InputArea onSubmit={handleSendText}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleFileUpload}
                    />

                    <AttachButton
                      type="button"
                      title="Đính kèm hình ảnh"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={20} />
                    </AttachButton>

                    <TextInput
                      type="text"
                      placeholder="Nhập nội dung phản hồi bệnh nhân (Enter để gửi)..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />

                    <SendButton
                      type="submit"
                      title="Gửi tin nhắn"
                      disabled={!inputText.trim()}
                    >
                      <Send size={18} />
                    </SendButton>
                  </InputArea>
                </>
              ) : (
                <EmptyArea>
                  <MessageCircle />
                  <h4>Chọn một cuộc hội thoại</h4>
                  <p>
                    Chọn khách hàng ở danh sách bên trái để bắt đầu hỗ trợ và tư
                    vấn dịch vụ nha khoa trực tuyến.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={{
                      marginTop: "1.6rem",
                      padding: "0.8rem 1.8rem",
                      borderRadius: "var(--border-radius-md)",
                      border: "1px solid var(--color-grey-200)",
                      background: "var(--color-grey-100)",
                      color: "var(--color-grey-700)",
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Đóng cửa sổ
                  </button>
                </EmptyArea>
              )}
            </ChatArea>
          </ChatContainer>
        </>
      )}

      {/* Lightbox Preview */}
      {lightboxImg && (
        <LightboxOverlay onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Phóng to ảnh" />
        </LightboxOverlay>
      )}
    </>
  );
}

export default AdminChat;
