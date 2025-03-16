
import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { cn } from "@/lib/utils";

type LanguageOption = {
  value: "de" | "en" | "es";
  label: string;
  flag: string;
};

const languages: LanguageOption[] = [
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "es", label: "Español", flag: "🇪🇸" },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLanguage = languages.find((lang) => lang.value === language) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLanguageSelect = (value: "de" | "en" | "es") => {
    setLanguage(value);
    closeDropdown();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-secondary focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden md:inline-flex">{selectedLanguage.label}</span>
        <span className="md:hidden">{selectedLanguage.flag}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeDropdown}
          />
          <ul
            className="absolute right-0 mt-2 w-48 p-1 z-20 glassmorphism rounded-lg shadow-elevated animate-in"
            role="listbox"
          >
            {languages.map((option) => (
              <li key={option.value}>
                <button
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-sm rounded-md",
                    option.value === language
                      ? "bg-accent1/10 text-accent1 font-medium"
                      : "text-foreground hover:bg-secondary/50"
                  )}
                  onClick={() => handleLanguageSelect(option.value)}
                  role="option"
                  aria-selected={option.value === language}
                >
                  <div className="flex items-center gap-2">
                    <span>{option.flag}</span>
                    <span>{option.label}</span>
                  </div>
                  {option.value === language && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
