"use client";

import { useState } from "react";
import { StepProps, BabyStage, SupportNetwork, BABY_STAGES, CHALLENGES, SUPPORT_OPTIONS } from "../types";

export default function Step3({ state, onNext, onBack, updateState }: StepProps) {
 const [subStep, setSubStep] = useState(0);

 const handleBabyStage = (stage: BabyStage) => {
 updateState({ babyStage: stage });
 setSubStep(1);
 };

 const handleFirstBaby = (isFirst: boolean) => {
 updateState({ firstBaby: isFirst });
 setSubStep(2);
 };

 const toggleChallenge = (id: string) => {
 const current = state.challenges;
 const updated = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
 updateState({ challenges: updated });
 };

 const handleSupport = (network: SupportNetwork) => {
 updateState({ supportNetwork: network });
 onNext();
 };

 return (
 <div className="flex flex-col items-center px-4 max-w-2xl mx-auto">
 {/* Back button */}
 <div className="w-full mb-6">
 <button
 onClick={subStep === 0 ? onBack : () => setSubStep(subStep - 1)}
 className="text-sm text-warm-gray-400 hover:text-warm-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100 rounded-lg px-2 py-1"
 aria-label="Go back"
 >
 ← Back
 </button>
 </div>

 {/* Sub-question A: Baby Stage */}
 {subStep === 0 && (
 <div className="w-full">
 <h2 className="font-heading text-2xl font-bold text-warm-gray-900 mb-6 text-center">
 Where are you in your journey?
 </h2>
 <div className="grid grid-cols-1 gap-3">
 {BABY_STAGES.map((stage) => (
 <button
 key={stage.id}
 onClick={() => handleBabyStage(stage.id)}
 className={`group p-5 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.babyStage === stage.id ? "border-primary-400 bg-primary-50" : "border-warm-gray-100 bg-white hover:border-primary-200 hover:shadow-sm"}`}
 aria-label={stage.label}
 >
 <div className="flex items-center gap-3">
 <span className="text-2xl group-hover:scale-110 transition-transform">{stage.emoji}</span>
 <span className="font-medium text-warm-gray-800">{stage.label}</span>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Sub-question B: First Baby */}
 {subStep === 1 && (
 <div className="w-full">
 <h2 className="font-heading text-2xl font-bold text-warm-gray-900 mb-6 text-center">
 Is this your first baby?
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <button
 onClick={() => handleFirstBaby(true)}
 className={`group p-6 rounded-3xl border-2 text-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.firstBaby === true ? "border-primary-400 bg-primary-50" : "border-warm-gray-100 bg-white hover:border-primary-200 hover:shadow-md"}`}
 aria-label="Yes, my first baby"
 >
 <span className="text-3xl block mb-2">✨</span>
 <span className="font-semibold text-warm-gray-900">Yes, my first</span>
 </button>
 <button
 onClick={() => handleFirstBaby(false)}
 className={`group p-6 rounded-3xl border-2 text-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.firstBaby === false ? "border-primary-400 bg-primary-50" : "border-warm-gray-100 bg-white hover:border-primary-200 hover:shadow-md"}`}
 aria-label="No, I have done this before"
 >
 <span className="text-3xl block mb-2">💪</span>
 <span className="font-semibold text-warm-gray-900">No, I've done this before</span>
 </button>
 </div>
 </div>
 )}

 {/* Sub-question C: Challenges */}
 {subStep === 2 && (
 <div className="w-full">
 <h2 className="font-heading text-2xl font-bold text-warm-gray-900 mb-2 text-center">
 What are you finding hardest right now?
 </h2>
 <p className="text-sm text-warm-gray-500 mb-6 text-center">Select all that apply</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
 {CHALLENGES.map((challenge) => (
 <button
 key={challenge.id}
 onClick={() => toggleChallenge(challenge.id)}
 className={`group p-4 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.challenges.includes(challenge.id) ? "border-primary-400 bg-primary-50" : "border-warm-gray-100 bg-white hover:border-primary-200"}`}
 aria-label={challenge.label}
 aria-pressed={state.challenges.includes(challenge.id)}
 >
 <div className="flex items-center gap-3">
 <span className="text-xl">{challenge.emoji}</span>
 <span className="text-sm font-medium text-warm-gray-800">{challenge.label}</span>
 </div>
 </button>
 ))}
 </div>
 <button
 onClick={() => setSubStep(3)}
 disabled={state.challenges.length === 0}
 className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mx-auto block focus:outline-none focus:ring-4 focus:ring-primary-200"
 >
 Continue
 </button>
 </div>
 )}

 {/* Sub-question D: Support Network */}
 {subStep === 3 && (
 <div className="w-full">
 <h2 className="font-heading text-2xl font-bold text-warm-gray-900 mb-6 text-center">
 Who do you have around you right now?
 </h2>
 <div className="grid grid-cols-1 gap-3">
 {SUPPORT_OPTIONS.map((option) => (
 <button
 key={option.id}
 onClick={() => handleSupport(option.id)}
 className={`group p-5 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.supportNetwork === option.id ? "border-primary-400 bg-primary-50" : "border-warm-gray-100 bg-white hover:border-primary-200 hover:shadow-sm"}`}
 aria-label={option.label}
 >
 <div className="flex items-center gap-3">
 <span className="text-2xl group-hover:scale-110 transition-transform">{option.emoji}</span>
 <span className="font-medium text-warm-gray-800">{option.label}</span>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}
