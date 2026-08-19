import { createContext, useContext, useEffect, useState } from "react";
import vi from "../locales/vi";
import en from "../locales/en";

const translations = { vi, en };

const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem("language");
    return stored === "en" || stored === "vi" ? stored : "vi";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language === "vi" ? "vi" : "en";
  }, [language]);

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value ?? key;
  };

  const changeLanguage = (lang) => {
    if (lang === "vi" || lang === "en") {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export { LanguageProvider, useLanguage };
