import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { X, ZoomIn, ZoomOut, Download, Maximize2, ShieldCheck, User as UserIcon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: rgba(10, 15, 29, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.2s ease-out;
  color: #f8fafc;
  user-select: none;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 2.4rem;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0) 100%);
  z-index: 10;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  .name-block {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .name {
    font-size: 1.6rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.2px;
  }

  .sub {
    font-size: 1.25rem;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .role-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.8rem;
    background: rgba(2, 132, 199, 0.2);
    border: 1px solid rgba(2, 132, 199, 0.4);
    color: #38bdf8;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.2rem;
  height: 4.2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    color: #ffffff;
  }

  &:active {
    transform: scale(0.95);
  }

  &.close-btn {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.35);
    color: #fca5a5;

    &:hover {
      background: rgba(239, 68, 68, 0.35);
      color: #ffffff;
    }
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const ImageWrapper = styled.div`
  animation: ${popIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  transform: scale(${(props) => props.$scale});
  max-width: 90vw;
  max-height: 75vh;
`;

const FullAvatarImg = styled.img`
  max-width: min(75vw, 560px);
  max-height: min(75vh, 560px);
  width: auto;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${(props) => (props.$isCircle ? "50%" : "2.4rem")};
  border: 4px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: border-radius 0.3s ease;
  user-select: none;
  pointer-events: auto;
`;

const FullInitialsAvatar = styled.div`
  width: min(70vw, 420px);
  height: min(70vw, 420px);
  border-radius: ${(props) => (props.$isCircle ? "50%" : "2.4rem")};
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: min(18vw, 12rem);
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 60px -15px rgba(2, 132, 199, 0.5);
  transition: border-radius 0.3s ease;
  text-transform: uppercase;
`;

const BottomHint = styled.div`
  padding: 1.4rem;
  text-align: center;
  font-size: 1.3rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }

  kbd {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.2rem 0.6rem;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    color: #cbd5e1;
  }
`;

function AvatarFullscreenModal({
  isOpen,
  onClose,
  src,
  name = "User",
  role = "",
  email = "",
}) {
  const { t } = useLanguage();
  const [scale, setScale] = useState(1);
  const [isCircle, setIsCircle] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      return;
    }

    // Lock body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Handle ESC key and zoom keys
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        setScale((prev) => Math.min(prev + 0.25, 2.5));
      } else if (e.key === "-" || e.key === "_") {
        setScale((prev) => Math.max(prev - 0.25, 0.75));
      } else if (e.key === "0") {
        setScale(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleToggleShape = (e) => {
    e.stopPropagation();
    setIsCircle((prev) => !prev);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!src) return;
    try {
      const link = document.createElement("a");
      link.href = src;
      link.download = `${name.replace(/\s+/g, "_")}_avatar.jpg`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(src, "_blank");
    }
  };

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(-2)
    : "US";

  return createPortal(
    <Overlay onClick={onClose}>
      <TopBar onClick={(e) => e.stopPropagation()}>
        <UserInfoSection>
          <div className="name-block">
            <div className="name">{name}</div>
            <div className="sub">
              {email && <span>{email}</span>}
              {role && (
                <span className="role-pill">
                  <ShieldCheck size={12} />
                  {role}
                </span>
              )}
            </div>
          </div>
        </UserInfoSection>

        <ActionsSection>
          <ActionBtn
            type="button"
            onClick={handleToggleShape}
            title={isCircle ? "Xem dạng vuông bo góc" : "Xem dạng hình tròn"}
          >
            <Maximize2 size={18} />
          </ActionBtn>

          <ActionBtn
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.75}
            title={t("avatar.zoomOut", "Thu nhỏ (-)")}
          >
            <ZoomOut size={18} />
          </ActionBtn>

          <ActionBtn
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 2.5}
            title={t("avatar.zoomIn", "Phóng to (+)")}
          >
            <ZoomIn size={18} />
          </ActionBtn>

          {src && (
            <ActionBtn
              type="button"
              onClick={handleDownload}
              title={t("avatar.download", "Tải ảnh về")}
            >
              <Download size={18} />
            </ActionBtn>
          )}

          <ActionBtn
            type="button"
            className="close-btn"
            onClick={onClose}
            title={t("avatar.close", "Đóng (ESC)")}
          >
            <X size={20} />
          </ActionBtn>
        </ActionsSection>
      </TopBar>

      <ContentContainer onClick={onClose}>
        <ImageWrapper
          $scale={scale}
          onClick={(e) => {
            e.stopPropagation();
            // Toggle zoom between 1x and 1.5x on image click
            setScale((prev) => (prev === 1 ? 1.5 : 1));
          }}
        >
          {src ? (
            <FullAvatarImg
              src={src}
              alt={name}
              $isCircle={isCircle}
              onError={(e) => {
                // If image fails, fallback to rendering initials
                e.target.style.display = "none";
              }}
            />
          ) : (
            <FullInitialsAvatar $isCircle={isCircle}>
              {initials}
            </FullInitialsAvatar>
          )}
        </ImageWrapper>
      </ContentContainer>

      <BottomHint onClick={(e) => e.stopPropagation()}>
        <span>
          <kbd>ESC</kbd> {t("avatar.close", "Đóng")}
        </span>
        <span>
          <kbd>+</kbd>/<kbd>-</kbd> {t("avatar.zoom", "Phóng to / Thu nhỏ")}
        </span>
        <span>
          {t("avatar.clickToZoom", "Nhấp vào ảnh để phóng to/thu nhỏ")}
        </span>
      </BottomHint>
    </Overlay>,
    document.body
  );
}

export default AvatarFullscreenModal;
