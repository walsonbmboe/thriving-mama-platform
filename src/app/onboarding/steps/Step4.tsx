"use client";

import { useState } from "react";
import { StepProps } from "../types";

const accordionItems = [
 { id: "collect", title: "What we collect", content: "Your profile details, mood check-ins, EPDS screening results, and conversations with your AI companion." },
 { id: "who_sees", title: "Who sees it", content: "Only you. Your conversations are completely private. Your counselor can only access your data if you book a session with them and give permission, or if a crisis is detected." },
 { id: "crisis", title: "What happens in a crisis", content: "If we ever detect that you may be in danger — through your messages or your EPDS score — we will immediately share relevant information with an on-call counselor and show you emergency contacts. This is the one time your privacy changes, and it exists only to keep you safe. You will always be told when this happens.", required: true },
 { id: "rights", title: "Your rights", content: "You can download your data, change your preferences, or delete your account at any time from Settings." },
];

export default function Step4({ state, onNext, onBack, updateState }: StepProps) {
 const [openItems, setOpenItems] = useState<Set<string>>(new Set());
 const [consentChecked, setConsentChecked] = useState(state.consentGiven);

 const crisisOpened = openItems.has("crisis");

 const toggleItem = (id: string) => {
 setOpenItems((prev) => {
 const next = new Set(prev);
 if (next.has(id)) { next.delete(id); } else { next.add(id); }
 return next;
 });
 };

 const handleConsent = () => {
 setConsentChecked(!consentChecked);
 updateState({ consentGiven: !consentChecked });
 };

 const handleContinue = () => {
 updateState({ consentGiven: true });
 onNext();
 };

 return (
 <div className="flex flex-col items-center px-4 max-w-2xl mx-auto">
 {/* Back button */}
 <div className="w-full mb-6">
 <button onClick={onBack} className="text-sm text-warm-gray-400 hover:text-warm-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100 rounded-lg px-2 py-1" aria-label="Go back">
 ← Back
 </button>
 </div>

 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-warm-gray-900 mb-2 text-center">
 Your privacy matters deeply to us.
 </h1>
 <p className="text-sm text-warm-gray-500 mb-8 text-center">
 Tap each section to learn more. You must read the crisis section before continuing.
 </p>

 {/* Accordion */}
 <div className="w-full space-y-3 mb-8">
 {accordionItems.map((item) => (
 <div key={item.id} className={`rounded-2xl border-2 overflow-hidden transition-all ${openItems.has(item.id) ? "border-primary-200 bg-primary-50/30" : "border-warm-gray-100 bg-white"} ${item.required && !crisisOpened ? "ring-2 ring-sunshine-300" : ""}`}>
 <button
 onClick={() => toggleItem(item.id)}
 className="w-full p-5 text-left flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-primary-100"
 aria-expanded={openItems.has(item.id)}
 aria-controls={`accordion-${item.id}`}
 >
 <span className="font-semibold text-warm-gray-800 flex items-center gap-2">
 {item.title}
 {item.required && !crisisOpened && <span className="text-xs bg-sunshine-200 text-sunshine-800 px-2 py-0.5 rounded-full">Required</span>}
 </span>
 <svg className={`w-5 h-5 text-warm-gray-400 transition-transform ${openItems.has(item.id) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
 </button>
 {openItems.has(item.id) && (
 <div id={`accordion-${item.id}`} className="px-5 pb-5">
 <p className="text-sm text-warm-gray-600 leading-relaxed">{item.content}</p>
 </div>
 )}
 </div>
 ))}
 </div>

 {/* Consent checkbox */}
 <div className="w-full mb-6">
 <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all ${consentChecked ? "border-primary-300 bg-primary-50" : "border-warm-gray-100 bg-white"} ${!crisisOpened ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
 <input
 type="checkbox"
 checked={consentChecked}
 onChange={handleConsent}
 disabled={!crisisOpened}
 className="mt-1 w-5 h-5 rounded border-warm-gray-300 text-primary-500 focus:ring-primary-400 disabled:opacity-50"
 aria-label="I understand and I am ready to begin"
 />
 <span className="text-sm text-warm-gray-700 font-medium">I understand and I'm ready to begin</span>
 </label>
 </div>

 {/* Continue button */}
 <button
 onClick={handleContinue}
 disabled={!consentChecked || !crisisOpened}
 className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-primary-200"
 >
 Let's begin
 </button>
 </div>
 );
}
