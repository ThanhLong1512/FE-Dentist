import React from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.$size === "lg" ? "1.4rem" : "1rem")};
  text-decoration: none;
  user-select: none;

  .logo-icon-badge {
    width: ${(props) =>
      props.$size === "lg" ? "5.4rem" : props.$size === "sm" ? "3.6rem" : "4.4rem"};
    height: ${(props) =>
      props.$size === "lg" ? "5.4rem" : props.$size === "sm" ? "3.6rem" : "4.4rem"};
    border-radius: ${(props) => (props.$size === "lg" ? "1.6rem" : "1.2rem")};
    background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
    box-shadow: 0 6px 18px rgba(14, 165, 233, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    svg {
      width: 68%;
      height: 68%;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }

  &:hover .logo-icon-badge {
    transform: scale(1.05) rotate(-2deg);
    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.5);
  }

  .logo-text-group {
    display: flex;
    flex-direction: column;
    line-height: 1.1;

    .brand-name {
      font-size: ${(props) =>
        props.$size === "lg" ? "2.6rem" : props.$size === "sm" ? "1.8rem" : "2.2rem"};
      font-weight: 850;
      letter-spacing: -0.03em;
      background: ${(props) =>
        props.$isDark
          ? "linear-gradient(135deg, #38bdf8 0%, #60a5fa 100%)"
          : "linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)"};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    }

    .brand-sub {
      font-size: ${(props) =>
        props.$size === "lg" ? "1.2rem" : props.$size === "sm" ? "0.95rem" : "1.1rem"};
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
      white-space: nowrap;
      margin-top: 0.2rem;
    }
  }
`;

export default function CheeseLogo({
  size = "md",
  isDark = false,
  showSubtitle = true,
  iconOnly = false,
  className = "",
  style = {},
}) {
  return (
    <LogoContainer
      $size={size}
      $isDark={isDark}
      className={`cheese-clinic-logo ${className}`}
      style={style}
    >
      <div className="logo-icon-badge">
        <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized Tooth */}
          <path
            d="M22 8 C15.5 8, 11 12, 11 18 C11 22, 12.5 26, 14.5 30 C16 32.5, 17 35, 18.5 35 C20 35, 20.5 32, 21.2 29 C21.6 27, 22.4 27, 22.8 29 C23.5 32, 24 35, 25.5 35 C27 35, 28 32.5, 29.5 30 C31.5 26, 33 22, 33 18 C33 12, 28.5 8, 22 8 Z"
            fill="#ffffff"
          />
          {/* Smile arc */}
          <path
            d="M17 19 Q22 25 27 19"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Golden Wink / Sparkle */}
          <path
            d="M34 5 L35 8.5 L38.5 9.5 L35 10.5 L34 14 L33 10.5 L29.5 9.5 L33 8.5 Z"
            fill="#fbbf24"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="logo-text-group">
          <span className="brand-name">Cheese Clinic</span>
          {showSubtitle && (
            <span className="brand-sub">Dental &amp; Implant Center</span>
          )}
        </div>
      )}
    </LogoContainer>
  );
}
