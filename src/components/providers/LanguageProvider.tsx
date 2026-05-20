"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { I18N, Language, LANG_META, TranslationSchema } from "@/lib/i18n";

type TranslationType = TranslationSchema;

interface LanguageContextType {
  lang: Language;
  t: TranslationType;
  setLang: (lang: Language) => void;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  t: I18N.th,
  setLang: () => {},
  isReady: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("th");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Read saved language from localStorage on client-side mount
    const savedLang = localStorage.getItem("pdm_lang") as Language;
    if (savedLang && I18N[savedLang]) {
      setLangState(savedLang);
    } else {
      // Default to browser language if it is English, otherwise Thai
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        setLangState("en");
      }
    }
    setIsReady(true);
  }, []);

  const setLang = (newLang: Language) => {
    if (I18N[newLang]) {
      setLangState(newLang);
      localStorage.setItem("pdm_lang", newLang);
      
      // Dispatch a custom event to notify other components/tabs if needed
      window.dispatchEvent(new Event("language_changed"));
    }
  };

  // Expose translation object matching active language
  const t = I18N[lang] || I18N.th;

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
