import React from "react";
import styled from "styled-components";

const LogoWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  user-select: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }

  .cheese-logo-img {
    height: ${(props) => {
      if (props.$size === "xl") return "72px";
      if (props.$size === "lg") return "56px";
      if (props.$size === "sm") return "34px";
      return "46px"; // "md" standard
    }};
    width: auto;
    max-width: 100%;
    object-fit: contain;
    display: block;
    /* In dark mode, apply a crisp subtle white glow filter so the black text 'NHA KHOA' is perfectly legible */
    filter: ${(props) =>
      props.$isDark
        ? "drop-shadow(0 0 1px #ffffff) drop-shadow(0 0 6px rgba(255, 255, 255, 0.45))"
        : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.04))"};
    transition: filter 0.3s ease, height 0.2s ease;
  }
`;

export default function CheeseLogo({
  size = "md",
  isDark = false,
  className = "",
  style = {},
}) {
  return (
    <LogoWrapper
      $size={size}
      $isDark={isDark}
      className={`cheese-clinic-logo ${className}`}
      style={style}
    >
      <img
        src="/logo.png"
        alt="Nha Khoa Cheese - Cheese Clinic"
        className="cheese-logo-img"
      />
    </LogoWrapper>
  );
}
