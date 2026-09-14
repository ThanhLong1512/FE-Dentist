import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  MessageSquare,
  Send,
  Image as ImageIcon,
  Mic,
  MicOff,
  X,
  Trash2,
  Play,
  Pause,
  Maximize2,
  Check,
  Loader2,
  Volume2,
  Sparkles,
  Paperclip,
  CheckCheck,
  Radio,
} from "lucide-react";
import { io } from "socket.io-client";
import {
  handleCreateMessage,
  handleCreateConservation,
  handleGetMessagesByConservation,
  handleUploadChatMedia,
} from "../apis";
import { SOCKET_URL, ADMIN_ID } from "../utils/constants";
import { useDarkMode } from "../hooks/useDarkMode";

// --- ANIMATIONS ---
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.5);
  }
  70% {
    box-shadow: 0 0 0 16px rgba(2, 132, 199, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(2, 132, 199, 0);
  }
`;

const slideUpFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const waveBar = keyframes`
  0%, 100% {
    height: 6px;
  }
  50% {
    height: 22px;
  }
`;

const typingBounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-6px);
    opacity: 1;
  }
`;

// --- STYLED COMPONENTS ---
const ChatWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const FloatingButton = styled.button`
  position: relative;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(2, 132, 199, 0.35);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${pulseGlow} 2.5s infinite;

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 12px 30px rgba(2, 132, 199, 0.45);
  }

  &:active {
    transform: scale(0.96);
  }

  .online-indicator {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #10b981;
    border: 2.5px solid #ffffff;
  }

  .badge {
    position: absolute;
    top: -4px;
    left: -4px;
    background-color: #ef4444;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    border: 2px solid #ffffff;
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 390px;
  height: 600px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 120px);
  border-radius: 20px;
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#f8fafc" : "#1e293b")};
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px ${(props) => (props.$isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)")};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  animation: ${slideUpFade} 0.28s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 480px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: auto;
    height: calc(100vh - 40px);
    border-radius: 16px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .doctor-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;

    .avatar-wrap {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #ffffff;
      padding: 2px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .status-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #10b981;
        border: 2px solid #ffffff;
      }
    }

    .meta {
      display: flex;
      flex-direction: column;
      min-width: 0;

      .name {
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .status-text {
        font-size: 1.2rem;
        opacity: 0.9;
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 6px;

    button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.28);
        transform: scale(1.05);
      }
    }
  }
`;

const QuickSuggestions = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  overflow-x: auto;
  white-space: nowrap;
  background: ${(props) => (props.$isDark ? "#131d33" : "#f8fafc")};
  border-bottom: 1px solid ${(props) => (props.$isDark ? "#1e293b" : "#e2e8f0")};
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .chip {
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 1.2rem;
    font-weight: 500;
    color: ${(props) => (props.$isDark ? "#38bdf8" : "#0284c7")};
    background: ${(props) => (props.$isDark ? "rgba(56, 189, 248, 0.1)" : "rgba(2, 132, 199, 0.08)")};
    border: 1px solid ${(props) => (props.$isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(2, 132, 199, 0.18)")};
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;

    &:hover {
      background: #0284c7;
      color: #ffffff;
      border-color: #0284c7;
      transform: translateY(-1px);
    }
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: ${(props) => (props.$isDark ? "#0b1329" : "#f8fafc")};
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};
    border-radius: 999px;
  }
`;

const DateDivider = styled.div`
  align-self: center;
  font-size: 1.1rem;
  color: ${(props) => (props.$isDark ? "#64748b" : "#94a3b8")};
  background: ${(props) => (props.$isDark ? "#1e293b" : "#e2e8f0")};
  padding: 3px 10px;
  border-radius: 999px;
  margin: 6px 0;
  font-weight: 500;
`;

const MessageRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  justify-content: ${(props) => (props.$isClient ? "flex-end" : "flex-start")};

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
`;

const MessageBubble = styled.div`
  max-width: 82%;
  padding: ${(props) => (props.$isImage ? "6px" : "10px 14px")};
  border-radius: ${(props) =>
    props.$isClient ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  background: ${(props) =>
    props.$isClient
      ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
      : props.$isDark
      ? "#1e293b"
      : "#ffffff"};
  color: ${(props) =>
    props.$isClient ? "#ffffff" : props.$isDark ? "#f8fafc" : "#1e293b"};
  box-shadow: 0 2px 6px ${(props) => (props.$isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.05)")};
  font-size: 1.35rem;
  line-height: 1.45;
  word-break: break-word;

  .text-content {
    margin: 0;
    white-space: pre-wrap;
  }

  .meta-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    font-size: 1.05rem;
    opacity: 0.75;
  }
`;

const ImageBubble = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;

  img {
    display: block;
    max-width: 240px;
    max-height: 240px;
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.02);
    }
  }

  .zoom-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }

  .image-caption {
    margin-top: 6px;
    padding: 0 4px;
    font-size: 1.25rem;
  }
`;

const VoiceBubble = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
  padding: 4px 2px;

  .play-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: ${(props) => (props.$isClient ? "rgba(255, 255, 255, 0.25)" : "#0284c7")};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.15s;

    &:hover {
      transform: scale(1.08);
    }
  }

  .audio-waveform {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 2.5px;
    height: 24px;

    .wave-bar {
      flex: 1;
      background: ${(props) => (props.$isClient ? "rgba(255, 255, 255, 0.7)" : "#0284c7")};
      border-radius: 2px;
      height: 6px;
      transition: height 0.15s;

      &.active {
        height: 20px;
        animation: ${waveBar} 0.6s ease-in-out infinite;
      }
    }
  }

  .duration {
    font-size: 1.15rem;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }
`;

const TypingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 18px 18px 18px 4px;
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  align-self: flex-start;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  .dots {
    display: flex;
    gap: 4px;

    span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #0284c7;
      animation: ${typingBounce} 1.2s infinite ease-in-out;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
`;

// Preview attached image before sending
const AttachmentPreviewBar = styled.div`
  padding: 8px 14px;
  background: ${(props) => (props.$isDark ? "#1e293b" : "#e2e8f0")};
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};

  .thumb-container {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-btn {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.65);
      color: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .file-name {
    flex: 1;
    font-size: 1.2rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

// Recording state bar
const RecordingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${(props) => (props.$isDark ? "#1e293b" : "#fef2f2")};
  border-top: 1px solid #fecaca;
  color: #ef4444;

  .rec-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ef4444;
    animation: ${pulseGlow} 1.2s infinite;
  }

  .rec-time {
    font-size: 1.35rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .wave-animation {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 3px;
    height: 20px;

    span {
      flex: 1;
      background: #ef4444;
      border-radius: 2px;
      height: 6px;
      animation: ${waveBar} 0.8s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.15s;
      }
      &:nth-child(3) {
        animation-delay: 0.3s;
      }
      &:nth-child(4) {
        animation-delay: 0.45s;
      }
      &:nth-child(5) {
        animation-delay: 0.6s;
      }
    }
  }

  .cancel-btn,
  .send-rec-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
      transform: scale(1.1);
    }
  }

  .cancel-btn {
    background: #fee2e2;
    color: #ef4444;
  }

  .send-rec-btn {
    background: #10b981;
    color: #ffffff;
  }
`;

const ChatInputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  border-top: 1px solid ${(props) => (props.$isDark ? "#1e293b" : "#e2e8f0")};

  .icon-tool-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      background: ${(props) => (props.$isDark ? "#1e293b" : "#f1f5f9")};
      color: #0284c7;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.recording-active {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
  }

  .input-field {
    flex: 1;
    border: 1px solid ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};
    background: ${(props) => (props.$isDark ? "#1e293b" : "#f8fafc")};
    color: ${(props) => (props.$isDark ? "#f8fafc" : "#1e293b")};
    padding: 10px 14px;
    border-radius: 20px;
    font-size: 1.35rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #0284c7;
      background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }

    &::placeholder {
      color: ${(props) => (props.$isDark ? "#64748b" : "#94a3b8")};
    }
  }

  .send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      transform: scale(1.08);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
`;

// Image Lightbox Modal
const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${slideUpFade} 0.2s ease-out;

  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 82vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .close-lightbox {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: #ffffff;
      font-size: 28px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .caption {
      color: #e2e8f0;
      font-size: 1.4rem;
      margin-top: 12px;
      text-align: center;
    }
  }
`;

// --- COMPONENT CHAT ---
export default function Chat() {
  const { isDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [conservationId, setConservationId] = useState(null);
  const [isLoadingConservation, setIsLoadingConservation] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Speech-to-text dictation state
  const [isDictating, setIsDictating] = useState(false);
  const speechRecognitionRef = useRef(null);

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioPlayerRef = useRef(new Audio());

  // Image attachment state
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef(null);

  // Lightbox preview modal state
  const [lightboxImage, setLightboxImage] = useState(null);

  const socket = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Audio player listener
  useEffect(() => {
    const player = audioPlayerRef.current;
    const handleEnded = () => setPlayingAudioId(null);
    player.addEventListener("ended", handleEnded);
    return () => {
      player.removeEventListener("ended", handleEnded);
      player.pause();
    };
  }, []);

  // Initialize user & socket
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setCurrentUserId(parsed.id || parsed._id);
      } catch (err) {
        console.error("Error parsing user info:", err);
      }
    }

    socket.current = io(`${SOCKET_URL}`);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Setup socket message listener
  useEffect(() => {
    if (currentUserId && socket.current) {
      socket.current.emit("addUser", currentUserId);

      socket.current.on("getMessage", ({ senderID, text, messageType = "text", mediaUrl = "" }) => {
        const newMessage = {
          id: Date.now(),
          text: text || "",
          messageType,
          mediaUrl,
          sender: "admin",
          senderID: senderID,
          timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);

        if (!isOpen) {
          setUnreadCount((c) => c + 1);
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("getMessage");
      }
    };
  }, [currentUserId, isOpen]);

  // Fetch messages when conversation opened
  useEffect(() => {
    if (conservationId) {
      fetchMessages();
    }
  }, [conservationId]);

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const response = await handleGetMessagesByConservation(conservationId);
      const formatted = (response || []).map((msg) => ({
        id: msg._id,
        text: msg.content,
        messageType: msg.messageType || (msg.mediaUrl ? "image" : "text"),
        mediaUrl: msg.mediaUrl || "",
        sender: msg.senderID === currentUserId ? "client" : "admin",
        senderID: msg.senderID,
        timestamp: formatTime(msg.createdAt),
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createConservation = async () => {
    try {
      setIsLoadingConservation(true);
      const response = await handleCreateConservation();
      if (response?.conservation?._id) {
        setConservationId(response.conservation._id);
      }
    } catch (err) {
      console.error("Error creating conservation:", err);
    } finally {
      setIsLoadingConservation(false);
    }
  };

  const toggleChat = async () => {
    if (!isOpen && !conservationId) {
      await createConservation();
    }
    if (!isOpen) {
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  // --- IMAGE HANDLING ---
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Dung lượng ảnh tối đa 10MB!");
      return;
    }

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setSelectedImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePasteImage = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        setSelectedImageFile(blob);
        const reader = new FileReader();
        reader.onload = () => setSelectedImagePreview(reader.result);
        reader.readAsDataURL(blob);
        e.preventDefault();
        break;
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImageFile(null);
    setSelectedImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- VOICE RECORDING HANDLING (MEDIA RECORDER) ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Không thể truy cập microphone. Vui lòng cấp quyền micro cho trình duyệt!");
    }
  };

  const stopAndCancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const stopAndSendRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      await sendVoiceMessage(audioBlob);
    };

    mediaRecorderRef.current.stop();
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
  };

  const sendVoiceMessage = async (audioBlob) => {
    if (!conservationId || !currentUserId) return;

    const localAudioUrl = URL.createObjectURL(audioBlob);
    const tempMessage = {
      id: Date.now(),
      text: "Tin nhắn thoại",
      messageType: "audio",
      mediaUrl: localAudioUrl,
      sender: "client",
      senderID: currentUserId,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append("file", audioBlob, "voice-message.webm");

      let uploadedUrl = localAudioUrl;
      try {
        const uploadRes = await handleUploadChatMedia(formData);
        if (uploadRes?.url) {
          uploadedUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn("Server audio upload fallback to inline:", uploadErr);
      }

      if (socket.current) {
        socket.current.emit("sendMessage", {
          senderID: currentUserId,
          receiverID: ADMIN_ID,
          text: "Tin nhắn thoại",
          messageType: "audio",
          mediaUrl: uploadedUrl,
        });
      }

      const response = await handleCreateMessage({
        conservationID: conservationId,
        content: "Tin nhắn thoại",
        messageType: "audio",
        mediaUrl: uploadedUrl,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, id: response._id, mediaUrl: uploadedUrl }
            : msg
        )
      );
    } catch (err) {
      console.error("Error sending voice message:", err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // --- SPEECH-TO-TEXT DICTATION (VIETNAMESE) ---
  const toggleSpeechDictation = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn chưa hỗ trợ nhận dạng giọng nói trực tiếp. Hãy dùng chức năng thu âm giọng nói bên cạnh!");
      return;
    }

    if (isDictating) {
      speechRecognitionRef.current?.stop();
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      speechRecognitionRef.current = recognition;
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsDictating(true);
      recognition.onend = () => setIsDictating(false);
      recognition.onerror = () => setIsDictating(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsDictating(false);
    }
  };

  // --- AUDIO PLAYBACK ---
  const togglePlayAudio = (id, mediaUrl) => {
    const player = audioPlayerRef.current;
    if (playingAudioId === id) {
      player.pause();
      setPlayingAudioId(null);
    } else {
      player.src = mediaUrl;
      player.play().catch((err) => console.error("Audio play error:", err));
      setPlayingAudioId(id);
    }
  };

  // --- SEND MESSAGE (TEXT / IMAGE) ---
  const handleSendMessage = async (e) => {
    e?.preventDefault?.();

    if (!conservationId || !currentUserId) {
      alert("Vui lòng đăng nhập để bắt đầu trò chuyện với Bác sĩ!");
      return;
    }

    const hasText = inputMessage.trim().length > 0;
    const hasImage = Boolean(selectedImageFile);

    if (!hasText && !hasImage) return;

    const messageType = hasImage ? "image" : "text";
    const tempText = hasText ? inputMessage : hasImage ? "Hình ảnh đính kèm" : "";
    const localMediaUrl = selectedImagePreview || "";

    const tempMessage = {
      id: Date.now(),
      text: tempText,
      messageType,
      mediaUrl: localMediaUrl,
      sender: "client",
      senderID: currentUserId,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, tempMessage]);
    const messageToSend = inputMessage;
    const imageFileToSend = selectedImageFile;

    setInputMessage("");
    removeSelectedImage();

    try {
      let finalMediaUrl = "";

      if (hasImage && imageFileToSend) {
        setIsUploadingMedia(true);
        const formData = new FormData();
        formData.append("file", imageFileToSend);

        try {
          const uploadRes = await handleUploadChatMedia(formData);
          if (uploadRes?.url) {
            finalMediaUrl = uploadRes.url;
          }
        } catch (uploadErr) {
          console.warn("Upload image API fallback to preview url:", uploadErr);
          finalMediaUrl = localMediaUrl;
        }
      }

      if (socket.current) {
        socket.current.emit("sendMessage", {
          senderID: currentUserId,
          receiverID: ADMIN_ID,
          text: messageToSend || (hasImage ? "Hình ảnh" : ""),
          messageType,
          mediaUrl: finalMediaUrl,
        });
      }

      const response = await handleCreateMessage({
        conservationID: conservationId,
        content: messageToSend || (hasImage ? "Hình ảnh" : ""),
        messageType,
        mediaUrl: finalMediaUrl,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, id: response._id, mediaUrl: finalMediaUrl || msg.mediaUrl }
            : msg
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
  };

  const formatRecSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <ChatWrapper>
      {/* Nút mở hộp chat (Floating Button) */}
      <FloatingButton
        type="button"
        onClick={toggleChat}
        title="Tư vấn trực tuyến với Nha sĩ"
        aria-label="Chat với nha sĩ"
      >
        <span className="online-indicator" />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </FloatingButton>

      {/* Cửa sổ Chat Window */}
      {isOpen && (
        <ChatWindow $isDark={isDarkMode}>
          {/* Header Bác sĩ */}
          <ChatHeader>
            <div className="doctor-profile">
              <div className="avatar-wrap">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
                  alt="Doctor"
                />
                <span className="status-dot" />
              </div>
              <div className="meta">
                <div className="name">Bác sĩ DENTIST PRO</div>
                <div className="status-text">
                  <span>Trực tuyến</span> • Sẵn sàng giải đáp 24/7
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ chat"
              >
                <X size={18} />
              </button>
            </div>
          </ChatHeader>

          {/* Quick Suggestions Pills */}
          <QuickSuggestions $isDark={isDarkMode}>
            <button
              type="button"
              className="chip"
              onClick={() => handleSuggestionClick("Bác sĩ tư vấn niềng răng giúp em với ạ")}
            >
              🦷 Tư vấn niềng răng
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => handleSuggestionClick("Chi phí cấy ghép răng Implant bao nhiêu ạ?")}
            >
              💎 Giá trồng Implant
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => handleSuggestionClick("Em muốn đặt lịch khám tổng quát hôm nay")}
            >
              📅 Đặt lịch khám
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => handleSuggestionClick("Tẩy trắng răng bằng công nghệ gì vậy Bác sĩ?")}
            >
              ✨ Tẩy trắng răng
            </button>
          </QuickSuggestions>

          {/* Messages Body */}
          <MessagesContainer $isDark={isDarkMode}>
            <DateDivider $isDark={isDarkMode}>Hôm nay</DateDivider>

            {/* Tin nhắn chào đầu tiên */}
            <MessageRow $isClient={false}>
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
                alt="Doctor"
                className="avatar"
              />
              <MessageBubble $isClient={false} $isDark={isDarkMode}>
                <p className="text-content">
                  Xin chào! Nha khoa DENTIST PRO có thể hỗ trợ kiểm tra hoặc giải đáp thắc mắc gì về sức khỏe răng miệng cho bạn hôm nay?
                </p>
                <div className="meta-info">
                  <span>Bác sĩ trực</span>
                </div>
              </MessageBubble>
            </MessageRow>

            {isLoadingMessages ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  color: "#0284c7",
                  gap: "8px",
                }}
              >
                <Loader2 size={20} className="animate-spin" />
                <span style={{ fontSize: "1.3rem" }}>Đang tải cuộc trò chuyện...</span>
              </div>
            ) : (
              messages.map((msg) => {
                const isClient = msg.sender === "client";
                const isImage = msg.messageType === "image";
                const isVoice = msg.messageType === "audio";

                return (
                  <MessageRow key={msg.id} $isClient={isClient}>
                    {!isClient && (
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
                        alt="Doctor"
                        className="avatar"
                      />
                    )}
                    <MessageBubble
                      $isClient={isClient}
                      $isDark={isDarkMode}
                      $isImage={isImage}
                    >
                      {/* Hình ảnh */}
                      {isImage ? (
                        <ImageBubble
                          onClick={() =>
                            setLightboxImage({
                              url: msg.mediaUrl || msg.text,
                              caption: msg.text !== "Hình ảnh" ? msg.text : "",
                            })
                          }
                        >
                          <img
                            src={msg.mediaUrl || msg.text}
                            alt="Chat image"
                            loading="lazy"
                          />
                          <div className="zoom-overlay">
                            <Maximize2 size={22} />
                          </div>
                          {msg.text && msg.text !== "Hình ảnh" && (
                            <p className="image-caption">{msg.text}</p>
                          )}
                        </ImageBubble>
                      ) : isVoice ? (
                        /* Tin nhắn ghi âm thoại */
                        <VoiceBubble $isClient={isClient}>
                          <button
                            type="button"
                            className="play-btn"
                            onClick={() => togglePlayAudio(msg.id, msg.mediaUrl)}
                            title="Nghe tin nhắn thoại"
                          >
                            {playingAudioId === msg.id ? (
                              <Pause size={18} />
                            ) : (
                              <Play size={18} style={{ marginLeft: "2px" }} />
                            )}
                          </button>
                          <div className="audio-waveform">
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                            <span className={`wave-bar ${playingAudioId === msg.id ? "active" : ""}`} />
                          </div>
                          <span className="duration">
                            {playingAudioId === msg.id ? "Đang phát" : "Thoại"}
                          </span>
                        </VoiceBubble>
                      ) : (
                        /* Tin nhắn văn bản */
                        <p className="text-content">{msg.text}</p>
                      )}

                      <div className="meta-info">
                        <span>{msg.timestamp}</span>
                        {isClient && <CheckCheck size={14} />}
                      </div>
                    </MessageBubble>
                  </MessageRow>
                );
              })
            )}

            {isTyping && (
              <TypingRow $isDark={isDarkMode}>
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span style={{ fontSize: "1.2rem", color: "#64748b" }}>
                  Bác sĩ đang nhập phản hồi...
                </span>
              </TypingRow>
            )}

            <div ref={messagesEndRef} />
          </MessagesContainer>

          {/* Khung xem trước ảnh đính kèm trước khi gửi */}
          {selectedImagePreview && (
            <AttachmentPreviewBar $isDark={isDarkMode}>
              <div className="thumb-container">
                <img src={selectedImagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={removeSelectedImage}
                  title="Hủy ảnh"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="file-name">
                {selectedImageFile?.name || "Hình ảnh đính kèm"}
              </div>
            </AttachmentPreviewBar>
          )}

          {/* Thanh hiển thị khi đang thu âm giọng nói */}
          {isRecording ? (
            <RecordingBar $isDark={isDarkMode}>
              <span className="rec-dot" />
              <span className="rec-time">{formatRecSeconds(recordingTime)}</span>
              <div className="wave-animation">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <button
                type="button"
                className="cancel-btn"
                onClick={stopAndCancelRecording}
                title="Hủy ghi âm"
              >
                <Trash2 size={18} />
              </button>
              <button
                type="button"
                className="send-rec-btn"
                onClick={stopAndSendRecording}
                title="Gửi ghi âm ngay"
              >
                <Check size={20} />
              </button>
            </RecordingBar>
          ) : (
            /* Thanh nhập tin nhắn thông thường */
            <ChatInputArea $isDark={isDarkMode} onSubmit={handleSendMessage}>
              {/* Nút gửi ảnh */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />
              <button
                type="button"
                className="icon-tool-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Gửi hình ảnh (hoặc dán Ctrl+V)"
                disabled={isUploadingMedia}
              >
                <ImageIcon size={20} />
              </button>

              {/* Nút thu âm giọng nói */}
              <button
                type="button"
                className="icon-tool-btn"
                onClick={startRecording}
                title="Bấm để ghi âm tin nhắn thoại"
                disabled={isUploadingMedia}
              >
                <Mic size={20} />
              </button>

              {/* Nút nói để chuyển thành chữ (Speech to Text) */}
              <button
                type="button"
                className={`icon-tool-btn ${isDictating ? "recording-active" : ""}`}
                onClick={toggleSpeechDictation}
                title={isDictating ? "Đang lắng nghe... (bấm để dừng)" : "Nói để nhập văn bản (Tiếng Việt)"}
              >
                <Radio size={19} />
              </button>

              {/* Ô nhập văn bản */}
              <input
                type="text"
                className="input-field"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onPaste={handlePasteImage}
                placeholder={
                  isDictating
                    ? "Đang nghe giọng nói của bạn..."
                    : selectedImageFile
                    ? "Nhập chú thích ảnh..."
                    : "Nhập tin nhắn (Ctrl+V để dán ảnh)..."
                }
                disabled={isUploadingMedia}
              />

              {/* Nút gửi tin nhắn */}
              <button
                type="submit"
                className="send-btn"
                disabled={
                  (!inputMessage.trim() && !selectedImageFile) ||
                  isUploadingMedia
                }
                title="Gửi tin nhắn"
              >
                {isUploadingMedia ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </ChatInputArea>
          )}
        </ChatWindow>
      )}

      {/* Modal phóng to ảnh Lightbox */}
      {lightboxImage && (
        <LightboxOverlay onClick={() => setLightboxImage(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-lightbox"
              onClick={() => setLightboxImage(null)}
            >
              ×
            </button>
            <img src={lightboxImage.url} alt="Enlarged preview" />
            {lightboxImage.caption && (
              <p className="caption">{lightboxImage.caption}</p>
            )}
          </div>
        </LightboxOverlay>
      )}
    </ChatWrapper>
  );
}
