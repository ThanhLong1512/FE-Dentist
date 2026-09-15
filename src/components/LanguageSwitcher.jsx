import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../hooks/useDarkMode";

// SVG Flag icons for guaranteed sharp rendering on Windows & all devices
const VietnamFlag = () => (
  <svg width="18" height="13" viewBox="0 0 900 600" style={{ borderRadius: "2px", flexShrink: 0 }}>
    <rect width="900" height="600" fill="#da251d" />
    <polygon
      points="450,150 491,277 625,277 516,356 558,483 450,404 342,483 384,356 275,277 409,277"
      fill="#ff0"
    />
  </svg>
);

const UKFlag = () => (
  <svg width="18" height="13" viewBox="0 0 60 30" style={{ borderRadius: "2px", flexShrink: 0 }}>
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const ChinaFlag = () => (
  <svg width="18" height="13" viewBox="0 0 900 600" style={{ borderRadius: "2px", flexShrink: 0 }}>
    <rect width="900" height="600" fill="#de2910" />
    <polygon points="150,50 181,145 281,145 200,204 231,299 150,240 69,299 100,204 19,145 119,145" fill="#ffde00" />
    <polygon points="300,40 307,62 330,62 311,76 318,98 300,84 282,98 289,76 270,62 293,62" fill="#ffde00" />
    <polygon points="360,100 367,122 390,122 371,136 378,158 360,144 342,158 349,136 330,122 353,122" fill="#ffde00" />
    <polygon points="360,180 367,202 390,202 371,216 378,238 360,224 342,238 349,216 330,202 353,202" fill="#ffde00" />
    <polygon points="300,240 307,262 330,262 311,276 318,298 300,284 282,298 289,276 270,262 293,262" fill="#ffde00" />
  </svg>
);

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const SwitcherTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 10px;
  border-radius: 9999px;
  border: 1px solid
    ${(props) =>
      props.$isOpen
        ? "#0284c7"
        : props.$isDark
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.1)"};
  background: ${(props) =>
    props.$isDark
      ? props.$isOpen
        ? "rgba(2, 132, 199, 0.18)"
        : "rgba(30, 41, 59, 0.85)"
      : props.$isOpen
      ? "rgba(2, 132, 199, 0.08)"
      : "rgba(248, 250, 252, 0.95)"};
  color: ${(props) => (props.$isDark ? "#f8fafc" : "#1e293b")};
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${(props) =>
    props.$isDark
      ? "0 2px 6px rgba(0, 0, 0, 0.2)"
      : "0 1px 3px rgba(0, 0, 0, 0.04)"};

  &:hover {
    border-color: #0284c7;
    background: ${(props) =>
      props.$isDark ? "rgba(2, 132, 199, 0.18)" : "rgba(2, 132, 199, 0.08)"};
    transform: translateY(-1px);
  }

  .lang-code {
    letter-spacing: 0.5px;
    font-size: 1.2rem;
    font-weight: 700;
    color: ${(props) => (props.$isDark ? "#e2e8f0" : "#334155")};
  }

  .chevron {
    transition: transform 0.2s ease;
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 170px;
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  border: 1px solid
    ${(props) =>
      props.$isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"};
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, ${(props) => (props.$isDark ? "0.45" : "0.12")});
  padding: 6px;
  z-index: 1000;
  animation: fadeInDown 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  border: none;
  background: ${(props) =>
    props.$isActive
      ? props.$isDark
        ? "rgba(2, 132, 199, 0.2)"
        : "rgba(2, 132, 199, 0.08)"
      : "transparent"};
  color: ${(props) =>
    props.$isActive
      ? "#0284c7"
      : props.$isDark
      ? "#f1f5f9"
      : "#1e293b"};
  font-size: 1.3rem;
  font-weight: ${(props) => (props.$isActive ? "700" : "500")};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${(props) =>
      props.$isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"};
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0284c7")};
  }

  .item-left {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .label-text {
    line-height: 1.2;
  }

  .check-icon {
    color: #0284c7;
  }
`;

export default function LanguageSwitcher({ className }) {
  const { language, changeLanguage } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  const currentLang = language === "en" ? "EN" : language === "zh" ? "ZH" : "VI";
  const renderTriggerFlag = () => {
    if (language === "en") return <UKFlag />;
    if (language === "zh") return <ChinaFlag />;
    return <VietnamFlag />;
  };

  return (
    <Container ref={containerRef} className={className}>
      <SwitcherTrigger
        type="button"
        $isDark={isDarkMode}
        $isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        title={
          language === "zh"
            ? "切换语言（中文 / English / Tiếng Việt）"
            : language === "en"
            ? "Change language (English / Vietnamese / Chinese)"
            : "Đổi ngôn ngữ (Tiếng Việt / English / Tiếng Trung)"
        }
        aria-label="Change language"
      >
        {renderTriggerFlag()}
        <span className="lang-code">{currentLang}</span>
        <ChevronDown size={14} className="chevron" />
      </SwitcherTrigger>

      {isOpen && (
        <DropdownMenu $isDark={isDarkMode}>
          <DropdownItem
            type="button"
            $isDark={isDarkMode}
            $isActive={language === "vi"}
            onClick={() => handleSelect("vi")}
          >
            <div className="item-left">
              <VietnamFlag />
              <span className="label-text">Tiếng Việt</span>
            </div>
            {language === "vi" && <Check size={16} className="check-icon" />}
          </DropdownItem>

          <DropdownItem
            type="button"
            $isDark={isDarkMode}
            $isActive={language === "en"}
            onClick={() => handleSelect("en")}
          >
            <div className="item-left">
              <UKFlag />
              <span className="label-text">English</span>
            </div>
            {language === "en" && <Check size={16} className="check-icon" />}
          </DropdownItem>

          <DropdownItem
            type="button"
            $isDark={isDarkMode}
            $isActive={language === "zh"}
            onClick={() => handleSelect("zh")}
          >
            <div className="item-left">
              <ChinaFlag />
              <span className="label-text">中文 (Tiếng Trung)</span>
            </div>
            {language === "zh" && <Check size={16} className="check-icon" />}
          </DropdownItem>
        </DropdownMenu>
      )}
    </Container>
  );
}
