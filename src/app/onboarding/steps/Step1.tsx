"use client";

import { useState } from "react";
import { StepProps, WellbeingStatus } from "../types";

export default function Step1({ state, onNext, updateState }: StepProps) {
 const [isPlaying, setIsPlaying] = useState(false);

 const handleSelect = (status: WellbeingStatus) => {
 updateState({ initialWellbeingStatus: status });
 if (status === "crisis") {
 window.location.href = "/mother/crisis-support";
 } else {
 onNext();
 }
 };

 const toggleAudio = () => {
 // Placeholder for Sharon audio playback
 setIsPlaying(!isPlaying);
 };

 return (
 <div className="flex flex-col items-center px-4 max-w-2xl mx-auto">
 {/* Welcome greeting */}
 <div className="text-center mb-10">
 <div className="mb-6">
 <button
 onClick={toggleAudio}
 className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-primary-50 border border-primary-100 hover:bg-primary-100 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-100"
 aria-label={isPlaying ? "Pause Sharon's welcome message" : "Play Sharon's welcome message"}
 >
 <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
 {isPlaying ? (
 <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
 ) : (
 <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
 )}
 </div>
 <span className="text-sm font-medium text-primary-700">
 {isPlaying ? "Playing..." : "Hear from Sharon"}
 </span>
 </button>
 </div>

 <h1 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900 mb-3">
 Welcome to ThrivingMama.
 </h1>
 <p className="text-xl text-warm-gray-700 font-medium mb-2">
 You've just taken the bravest step.
 </p>
 <p className="text-warm-gray-500">
 We're here to walk with you — at 2am, in your language, without judgment.
 </p>
 </div>

 {/* Triage question */}
 <div className="w-full">
 <p className="text-center text-warm-gray-700 font-medium mb-6">
 Before we begin — how are you feeling right now?
 </p>

 <div className="grid grid-cols-1 gap-4">
 {/* Card A: Okay */}
 <button
 onClick={() => handleSelect("okay")}
 className={`group p-6 rounded-3xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.initialWellbeingStatus === "okay" ? "border-primary-400 bg-primary-50" : "border-warm-gray-100 bg-white hover:border-primary-200 hover:shadow-md"}`}
 aria-label="I am okay, just looking for support"
 >
 <div className="flex items-center gap-4">
 <span className="text-3xl group-hover:scale-110 transition-transform">🌿</span>
 <div>
 <h3 className="font-semibold text-warm-gray-900">I'm okay, just looking for support</h3>
 <p className="text-sm text-warm-gray-500 mt-0.5">I want to explore what's available</p>
 </div>
 </div>
 </button>

 {/* Card B: Struggling */}
 <button
 onClick={() => handleSelect("struggling")}
 className={`group p-6 rounded-3xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100 ${state.initialWellbeingStatus === "struggling" ? "border-primary-400 bg-primary-50" : "border-warm-gray-100 bg-white hover:border-primary-200 hover:shadow-md"}`}
 aria-label="I am struggling but managing"
 >
 <div className="flex items-center gap-4">
 <span className="text-3xl group-hover:scale-110 transition-transform">🌧️</span>
 <div>
 <h3 className="font-semibold text-warm-gray-900">I'm struggling but managing</h3>
 <p className="text-sm text-warm-gray-500 mt-0.5">Some days are harder than others</p>
 </div>
 </div>
 </button>

 {/* Card C: Crisis */}
 <button
 onClick={() => handleSelect("crisis")}
 className={`group p-6 rounded-3xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-100 ${state.initialWellbeingStatus === "crisis" ? "border-red-400 bg-red-50" : "border-warm-gray-100 bg-white hover:border-red-200 hover:shadow-md"}`}
 aria-label="I am really not okay right now"
 >
 <div className="flex items-center gap-4">
 <span className="text-3xl group-hover:scale-110 transition-transform">🆘</span>
 <div>
 <h3 className="font-semibold text-warm-gray-900">I'm really not okay right now</h3>
 <p className="text-sm text-warm-gray-500 mt-0.5">I need help today</p>
 </div>
 </div>
 </button>
 </div>
 </div>
 </div>
 );
}
