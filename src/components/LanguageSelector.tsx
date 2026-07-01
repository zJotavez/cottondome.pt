import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

// Inline Flag SVGs to render correctly on all OS (including Windows)
const FlagPT = () => (
  <svg viewBox="0 0 600 400" className="w-4 h-2.5 md:w-5 md:h-3.5 rounded-sm object-cover shadow-sm flex-shrink-0">
    <rect width="240" height="400" fill="#006600" />
    <rect x="240" width="360" height="400" fill="#FF0000" />
    {/* Coat of arms simplified */}
    <circle cx="240" cy="200" r="60" fill="#FFCC00" />
    <path d="M 240,160 C 218,160 210,180 210,200 C 210,220 218,240 240,240 C 262,240 270,220 270,200 C 270,180 262,160 240,160 Z" fill="#ffffff" stroke="#ff0000" strokeWidth="8" />
    <rect x="225" y="180" width="30" height="40" fill="#002266" />
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="w-4 h-2.5 md:w-5 md:h-3.5 rounded-sm object-cover shadow-sm flex-shrink-0">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="3.5" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#c8102e" strokeWidth="6" />
  </svg>
);

const FlagFR = () => (
  <svg viewBox="0 0 3 2" className="w-4 h-2.5 md:w-5 md:h-3.5 rounded-sm object-cover shadow-sm flex-shrink-0">
    <rect width="1" height="2" fill="#00209F" />
    <rect x="1" width="1" height="2" fill="#FFFFFF" />
    <rect x="2" width="1" height="2" fill="#F6424D" />
  </svg>
);

interface LanguageSelectorProps {
  currentLang: "pt" | "en" | "fr";
  onLangChange: (lang: "pt" | "en" | "fr") => void;
}

export function LanguageSelector({ currentLang, onLangChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "pt", flag: <FlagPT />, label: "Português" },
    { code: "en", flag: <FlagGB />, label: "English" },
    { code: "fr", flag: <FlagFR />, label: "Français" }
  ] as const;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLang = languages.find((lang) => lang.code === currentLang) || languages[0];

  return (
    <div ref={containerRef} className="fixed top-[26px] right-[58px] md:top-6 md:right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Alterar Idioma / Change Language"
          className="flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:px-3 md:py-2.5 rounded-full bg-[#111111]/90 border border-white/10 hover:border-[#E2AF55] text-white hover:text-[#E2AF55] shadow-lg shadow-black/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          {activeLang.flag}
          <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-0 w-44 rounded-xl bg-[#111111] border border-white/10 shadow-2xl p-1.5 flex flex-col gap-1 z-50 backdrop-blur-md"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLangChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    currentLang === lang.code
                      ? "bg-[#E2AF55]/10 text-[#E2AF55]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {lang.flag}
                  <span>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
