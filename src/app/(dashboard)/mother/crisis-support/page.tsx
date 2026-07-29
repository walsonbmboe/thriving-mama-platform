"use client";

import Link from "next/link";

export default function CrisisSupportPage() {
 return (
 <div className="min-h-screen bg-gradient-to-b from-red-50 to-warm-gray-50 flex flex-col items-center justify-center px-4 py-12">
 <div className="max-w-lg w-full text-center">
 {/* Header */}
 <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
 <span className="text-4xl">🩷</span>
 </div>

 <h1 className="font-heading text-3xl font-bold text-warm-gray-900 mb-4">
 We're here for you right now.
 </h1>
 <p className="text-warm-gray-600 mb-8 leading-relaxed">
 You are not alone. If you're in immediate danger, please reach out to one of these services. They are free, confidential, and available now.
 </p>

 {/* Emergency contacts */}
 <div className="space-y-4 mb-10">
 <div className="p-5 rounded-2xl bg-white border-2 border-red-100 shadow-sm">
 <p className="font-semibold text-warm-gray-900">Emergency Services</p>
 <p className="text-2xl font-bold text-red-600 mt-1">112</p>
 <p className="text-sm text-warm-gray-500 mt-1">Available 24/7</p>
 </div>
 <div className="p-5 rounded-2xl bg-white border-2 border-red-100 shadow-sm">
 <p className="font-semibold text-warm-gray-900">Suicide & Crisis Lifeline</p>
 <p className="text-2xl font-bold text-red-600 mt-1">988</p>
 <p className="text-sm text-warm-gray-500 mt-1">Call or text, 24/7</p>
 </div>
 <div className="p-5 rounded-2xl bg-white border-2 border-red-100 shadow-sm">
 <p className="font-semibold text-warm-gray-900">Postpartum Support International</p>
 <p className="text-2xl font-bold text-red-600 mt-1">1-800-944-4773</p>
 <p className="text-sm text-warm-gray-500 mt-1">Text “HELP” to 988</p>
 </div>
 </div>

 {/* Actions */}
 <div className="space-y-4">
 <Link
 href="/mother/chat"
 className="block w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-primary-200"
 >
 Talk to someone now
 </Link>

 <Link
 href="/onboarding"
 className="block text-sm text-warm-gray-500 hover:text-warm-gray-700 transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary-100 rounded-lg"
 >
 I want to keep setting up my account
 </Link>
 </div>
 </div>
 </div>
 );
}
