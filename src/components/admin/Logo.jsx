import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  display: inline-block;

  svg {
    height: 9.6rem;
    width: auto;
    max-width: 100%;
  }
`;

function Logo() {
  return (
    <StyledLogo>
      <svg
        viewBox="0 0 350 140"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="logo-title"
      >
        <title id="logo-title">Chesse Dental Logo</title>

        <defs>
          <linearGradient
            id="toothGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#f8f9ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#e8f4f8" stopOpacity="1" />
          </linearGradient>

          <linearGradient
            id="backgroundGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#20b2aa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4682b4" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="1" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="glowEffect" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation="3"
              floodColor="#000000"
              floodOpacity="0.2"
            />
          </filter>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="60"
          cy="70"
          r="55"
          fill="url(#backgroundGradient)"
          opacity="0.3"
        >
          <animate
            attributeName="r"
            values="55;58;55"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        <g transform="translate(25, 25)" filter="url(#dropShadow)">
          <path
            d="M35 15 
             C45 8, 55 8, 65 15
             C72 22, 72 35, 70 48
             C68 62, 62 75, 52 85
             C45 92, 25 92, 18 85
             C8 75, 2 62, 0 48
             C-2 35, -2 22, 5 15
             C15 8, 25 8, 35 15 Z"
            fill="url(#toothGradient)"
            stroke="#20b2aa"
            strokeWidth="2"
          />

          <ellipse cx="25" cy="35" rx="12" ry="20" fill="url(#glowEffect)" />
          <g opacity="0.8">
            <path d="M20 25 L22 27 L20 29 L18 27 Z" fill="#00d4aa">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 20 27;360 20 27"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M45 40 L47 42 L45 44 L43 42 Z" fill="#4682b4">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360 45 42;0 45 42"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          <path
            d="M18 85 L15 95 C15 98, 18 100, 21 100 L24 95 Z"
            fill="url(#toothGradient)"
            stroke="#20b2aa"
            strokeWidth="2"
          />
          <path
            d="M52 85 L49 95 C49 98, 52 100, 55 100 L58 95 Z"
            fill="url(#toothGradient)"
            stroke="#20b2aa"
            strokeWidth="2"
          />
        </g>

        <g transform="translate(130, 0)">
          <text
            x="0"
            y="50"
            fontFamily="'Segoe UI', Arial, sans-serif"
            fontSize="36"
            fontWeight="700"
            fill="url(#textGradient)"
            filter="url(#glow)"
          >
            Chesse
          </text>

          <text
            x="0"
            y="80"
            fontFamily="'Segoe UI', Arial, sans-serif"
            fontSize="18"
            fontWeight="300"
            letterSpacing="3px"
            fill="#4682b4"
          >
            D E N T A L
          </text>

          <line
            x1="0"
            y1="90"
            x2="120"
            y2="90"
            stroke="url(#textGradient)"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,120;120,0;0,120"
              dur="6s"
              repeatCount="indefinite"
            />
          </line>
        </g>
        <g opacity="0.7">
          <circle cx="280" cy="30" r="4" fill="#00d4aa">
            <animate
              attributeName="cy"
              values="30;25;30"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="295" cy="45" r="3" fill="#4682b4">
            <animate
              attributeName="cy"
              values="45;40;45"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="310" cy="35" r="3.5" fill="#20b2aa">
            <animate
              attributeName="cy"
              values="35;30;35"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        <path
          d="M130 100 Q200 110 270 100"
          stroke="url(#textGradient)"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0,140;70,70;140,0;0,140"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>

        <g opacity="0.4">
          <circle cx="100" cy="20" r="1.5" fill="#ffffff">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="250" cy="60" r="1" fill="#00d4aa">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </StyledLogo>
  );
}

export default Logo;
