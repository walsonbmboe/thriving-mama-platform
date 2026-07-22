"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "EN" },
  { value: "fr", label: "Fran\u00e7ais", flag: "FR" },
  { value: "pcm", label: "Pidgin", flag: "PCM" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-warm-gray-100 rounded-lg p-0.5">
      {languageOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setLanguage(option.value)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            language === option.value
              ? "bg-white text-primary-600 shadow-sm"
              : "text-warm-gray-500 hover:text-warm-gray-700"
          }`}
          aria-label={`Switch language to ${option.label}`}
          title={option.label}
        >
          {option.flag}
        </button>
      ))}
    </div>
  );
}
