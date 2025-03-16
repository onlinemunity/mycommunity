
import { createContext, useState, useEffect, ReactNode } from "react";

type Language = "de" | "en" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const defaultLanguage: Language = "de";

export const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: () => "",
});

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLang = localStorage.getItem("language") as Language;
    return savedLang ? savedLang : defaultLanguage;
  });
  
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Save the language preference to localStorage
    localStorage.setItem("language", language);
    
    // Load the translations for the current language
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const translationModule = await import(`../translations/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to English if translation file can't be loaded
        if (language !== "en") {
          const fallbackModule = await import(`../translations/en.json`);
          setTranslations(fallbackModule.default);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (isLoading) return "";
    
    // Split the key by dots to access nested properties
    const keys = key.split(".");
    let value = translations;
    
    // Navigate through the nested properties
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
