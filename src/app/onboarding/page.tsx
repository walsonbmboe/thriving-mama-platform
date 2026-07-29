"use client";

import { useOnboarding } from "./hooks/useOnboarding";
import Step0 from "./steps/Step0";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";

export default function OnboardingPage() {
 const { state, updateState, onNext, onBack, isTransitioning, isHydrated } = useOnboarding();

 if (!isHydrated) {
 return (
 <div className="min-h-screen bg-gradient-to-b from-warm-gray-50 to-white flex items-center justify-center">
 <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
 </div>
 );
 }

 const stepProps = { state, updateState, onNext, onBack };

 const showProgressBar = state.currentStep >= 1 && state.currentStep <= 5;

 return (
 <div className="min-h-screen bg-gradient-to-b from-warm-gray-50 to-white flex flex-col">
 {/* Progress bar */}
 {showProgressBar && (
 <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-warm-gray-100 px-4 py-3">
 <div className="max-w-2xl mx-auto">
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs text-warm-gray-500 font-medium">Step {state.currentStep} of 5</span>
 </div>
 <div className="w-full h-2 bg-warm-gray-100 rounded-full overflow-hidden">
 <div
 className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full transition-all duration-500 ease-out"
 style={{ width: `${(state.currentStep / 5) * 100}%` }}
 role="progressbar"
 aria-valuenow={state.currentStep}
 aria-valuemin={0}
 aria-valuemax={5}
 aria-label={`Onboarding progress: step ${state.currentStep} of 5`}
 />
 </div>
 </div>
 </div>
 )}

 {/* Step content */}
 <div className={`flex-1 flex items-center py-12 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
 <div className="w-full">
 {state.currentStep === 0 && <Step0 {...stepProps} />}
 {state.currentStep === 1 && <Step1 {...stepProps} />}
 {state.currentStep === 2 && <Step2 {...stepProps} />}
 {state.currentStep === 3 && <Step3 {...stepProps} />}
 {state.currentStep === 4 && <Step4 {...stepProps} />}
 {state.currentStep === 5 && <Step5 {...stepProps} />}
 {state.currentStep === 6 && <Step6 {...stepProps} />}
 </div>
 </div>
 </div>
 );
}
