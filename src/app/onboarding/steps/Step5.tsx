"use client";

import { StepProps } from "../types";

export default function Step5({ state, onNext, onBack, updateState }: StepProps) {
 const handleBeginEpds = () => {
 updateState({ epdsChoice: "started" });
 window.location.href = "/mother/epds?source=onboarding";
 };

 const handleSkip = () => {
 updateState({ epdsChoice: "skipped" });
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

 <div className="text-center">
 <div className="w-16 h-16 mx-auto mb-6 bg-sunshine-100 rounded-full flex items-center justify-center">
 <span className="text-3xl">🌻</span>
 </div>

 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-warm-gray-900 mb-4">
 Your first act of self-care starts here.
 </h1>

 <p className="text-warm-gray-600 leading-relaxed mb-8 max-w-lg mx-auto">
 Before you meet your AI companion, we'd like to understand where you are today. This is a validated 10-question check-in used by maternal health professionals worldwide. It takes 2 minutes and helps us personalise your support from day one.
 </p>

 {/* Primary CTA */}
 <button
 onClick={handleBeginEpds}
 className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-200 mb-4"
 >
 Begin my check-in
 </button>

 {/* Secondary skip */}
 <button
 onClick={handleSkip}
 className="block mx-auto text-sm text-warm-gray-400 hover:text-warm-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2"
 >
 I'll do this later
 </button>
 </div>
 </div>
 );
}
