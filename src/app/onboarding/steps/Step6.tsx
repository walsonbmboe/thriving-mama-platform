"use client";

import { useEffect } from "react";
import { StepProps } from "../types";

export default function Step6({ state }: StepProps) {
 useEffect(() => {
 // In production: write analytics event and schedule notification
 console.log("[Analytics] onboarding_completed", { timestamp: new Date().toISOString() });
 }, []);

 const handleEnter = () => {
 localStorage.removeItem("thriving-mama-onboarding");
 window.location.href = "/mother";
 };

 return (
 <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
 {/* Animated heart */}
 <div className="mb-8">
 <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center animate-pulse">
 <span className="text-5xl">🩷</span>
 </div>
 </div>

 <h1 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900 mb-4">
 You're not alone anymore.
 </h1>

 <p className="text-warm-gray-600 leading-relaxed max-w-md mx-auto mb-2">
 Your space is ready. We'll check in on you tomorrow — just a gentle hello, no pressure.
 </p>
 <p className="text-warm-gray-500 text-sm mb-10">
 You don't have to do anything. We just want you to know we're here.
 </p>

 <button
 onClick={handleEnter}
 className="px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-200"
 >
 Enter ThrivingMama
 </button>

 {/* Soft decorative elements */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
 <div className="absolute top-20 left-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50" />
 <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-100 rounded-full blur-3xl opacity-50" />
 <div className="absolute top-40 right-20 w-24 h-24 bg-sunshine-100 rounded-full blur-2xl opacity-40" />
 </div>
 </div>
 );
}
