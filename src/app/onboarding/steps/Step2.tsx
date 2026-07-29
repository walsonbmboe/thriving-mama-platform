"use client";

import { StepProps } from "../types";
import type { Language } from "../types";

const languages = [
 { id: "en" as Language, flag: "🌍", name: "English", cta: "Continue in English", preview: "Your safe space, always here for you." },
 { id: "fr" as Language, flag: "🇨🇲", name: "Fran\u00E7ais", cta: "Continuer en fran\u00E7ais", preview: "Votre espace s\u00FBr, toujours l\u00E0 pour vous." },
 { id: "pcm" as Language, flag: "🌍", name: "Pidgin English", cta: "Kontinu for Pidgin", preview: "Your safe space, e dey here for you always." },
];

export default function Step2({ state, onNext, onBack, updateState }: StepProps) {
 const handleSelect = (lang: Language) => {
 updateState({ languagePreference: lang });
 };

 const selectedLang = languages.find((l) => l.id === state.languagePreference);

 return (
 <div className="flex flex-col items-center px-4 max-w-2xl mx-auto">
 {/* Back button */}
 <div className="w-full mb-6">
 <button
 onClick={onBack}
 className="text-sm text-warm-gray-400 hover:text-warm-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100 rounded-lg px-2 py-1"
 aria-label="Go back to previous step"
 >
 ← Back
 </button>
 </div>

 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-warm-gray-900 mb-2 text-center">
 Choose your language
 </h1>
 <p className="text-warm-gray-500 mb-8 text-center text-sm">
 Choisissez votre langue / Wich langwej yu want?
 </p>

 <div className="grid grid-cols-1 gap-4 w-full mb-8">
 {languages.map((lang) => (
 <button
 key={lang.id}
 onClick={() => handleSelect(lang.id)}
 className={`group p-6 rounded-3xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.languagePreference === lang.id ? "border-primary-400 bg-primary-50 shadow-md" : "border-warm-gray-100 bg-white hover:border-primary-200 hover:shadow-md"}`}
 aria-label={`Select ${lang.name}`}
 aria-pressed={state.languagePreference === lang.id}
 >
 <div className="flex items-center gap-4">
 <span className="text-3xl">{lang.flag}</span>
 <div className="flex-1">
 <h3 className="font-semibold text-warm-gray-900">{lang.name}</h3>
 <p className="text-sm text-warm-gray-500 mt-0.5">{lang.cta}</p>
 <p className="text-xs text-warm-gray-400 mt-1 italic">\"{lang.preview}\"</p>
 </div>
 {state.languagePreference === lang.id && (
 <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
 </div>
 )}
 </div>
 </button>
 ))}
 </div>

 {/* Continue button */}
 <button
 onClick={onNext}
 disabled={!state.languagePreference}
 className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-primary-200"
 >
 {selectedLang ? selectedLang.cta : "Continue"}
 </button>
 </div>
 );
}
