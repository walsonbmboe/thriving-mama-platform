"use client";

import Image from "next/image";
import { StepProps } from "../types";

export default function Step0({ onNext }: StepProps) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative">
 {/* Background decorations */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
 <div className="absolute top-10 left-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60" />
 <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-100 rounded-full blur-3xl opacity-50" />
 <div className="absolute top-40 right-20 w-48 h-48 bg-sunshine-100 rounded-full blur-3xl opacity-40" />
 <div className="absolute bottom-10 left-20 w-32 h-32 bg-earth-100 rounded-full blur-2xl opacity-50" />
 </div>

 {/* Logo */}
 <div className="mb-6">
 <Image src="/logo.jpeg" alt="ThrivingMama" width={72} height={72} className="w-18 h-18 rounded-full object-cover shadow-lg border-4 border-white" />
 </div>

 {/* Welcome heading */}
 <h1 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900 text-center mb-3">
 Welcome to ThrivingMama
 </h1>

 {/* Warm message */}
 <div className="max-w-lg text-center mb-10">
 <p className="text-warm-gray-600 leading-relaxed mb-3">
 You just did something brave. Whatever brought you here today, know that this is a place of warmth, understanding, and zero judgment.
 </p>
 <p className="text-warm-gray-500 text-sm italic">
 This is a safe space. Who brought you here today?
 </p>
 </div>

 {/* Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
 {/* Card 1: Mama */}
 <button
 onClick={onNext}
 className="group relative p-8 rounded-3xl border-2 border-primary-100 bg-gradient-to-br from-white to-primary-50 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-primary-100"
 aria-label="I am a mama looking for support"
 >
 <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🤱</div>
 <h2 className="font-heading text-xl font-bold text-warm-gray-900 mb-2">
 I'm a mama looking for support
 </h2>
 <p className="text-sm text-warm-gray-500">
 Whether you're pregnant or postpartum, this space is yours.
 </p>
 <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
 </div>
 </button>

 {/* Card 2: Supporter */}
 <button
 onClick={() => { window.location.href = "/family-portal"; }}
 className="group relative p-8 rounded-3xl border-2 border-secondary-100 bg-gradient-to-br from-white to-secondary-50 hover:border-secondary-300 hover:shadow-xl hover:shadow-secondary-100/50 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-secondary-100"
 aria-label="I am here to support someone I love"
 >
 <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🤝</div>
 <h2 className="font-heading text-xl font-bold text-warm-gray-900 mb-2">
 I'm here to support someone I love
 </h2>
 <p className="text-sm text-warm-gray-500">
 Resources for partners, family, and friends.
 </p>
 <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
 </div>
 </button>
 </div>
 </div>
 );
}
