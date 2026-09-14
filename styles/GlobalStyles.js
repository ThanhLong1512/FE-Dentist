import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  &, &.light-mode {
  /* Grey */
  --color-grey-0: #fff;
  --color-grey-50: #f9fafb;
  --color-grey-100: #f3f4f6;
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;

  --color-blue-100: #e0f2fe;
  --color-blue-700: #0369a1;
  --color-green-100: #dcfce7;
  --color-green-700: #15803d;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;
  --color-indigo-100: #e0e7ff;
  --color-indigo-700: #4338ca;

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

  --backdrop-color: rgba(255, 255, 255, 0.1);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  --shadow-elevation: 0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 0 25px rgba(14, 165, 233, 0.25);
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(226, 232, 240, 0.8);

  --image-grayscale: 0;
  --image-opacity: 100%;
  }
  
  &.dark-mode {
    --color-grey-0: #0f172a;
    --color-grey-50: #1e293b;
    --color-grey-100: #334155;
    --color-grey-200: #475569;
    --color-grey-300: #64748b;
    --color-grey-400: #94a3b8;
    --color-grey-500: #cbd5e1;
    --color-grey-600: #e2e8f0;
    --color-grey-700: #f1f5f9;
    --color-grey-800: #f8fafc;
    --color-grey-900: #ffffff;

    --color-blue-100: #075985;
    --color-blue-700: #e0f2fe;
    --color-green-100: #166534;
    --color-green-700: #dcfce7;
    --color-yellow-100: #854d0e;
    --color-yellow-700: #fef9c3;
    --color-silver-100: #334155;
    --color-silver-700: #f1f5f9;
    --color-indigo-100: #3730a3;
    --color-indigo-700: #e0e7ff;

    --color-red-100: #7f1d1d;
    --color-red-700: #fecaca;
    --color-red-800: #fee2e2;

    --backdrop-color: rgba(0, 0, 0, 0.4);

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);
    --shadow-elevation: 0 10px 30px -5px rgba(0, 0, 0, 0.4);
    --shadow-glow: 0 0 25px rgba(14, 165, 233, 0.4);
    --glass-bg: rgba(15, 23, 42, 0.85);
    --glass-border: rgba(51, 65, 85, 0.7);

    --image-grayscale: 10%;
    --image-opacity: 90%;
  }
  
  /* Brand Medical Cyan/Blue Palette */
  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-200: #bae6fd;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;
  --color-brand-700: #0369a1;
  --color-brand-800: #075985;
  --color-brand-900: #0c4a6e;
  --color-brand-gradient: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  --color-brand-gradient-hover: linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%);
  
  --border-radius-tiny: 4px;
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --border-radius-xl: 20px;
  --border-radius-full: 9999px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  color: var(--color-grey-700);
  background-color: var(--color-grey-0);
  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

input,
button,
textarea,
select {
  font-family: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-size: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

/* Parent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  letter-spacing: -0.02em;
}

p {
  overflow-wrap: break-word;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

`;

export default GlobalStyles;

/*
FOR DARK MODE

--color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
*/
