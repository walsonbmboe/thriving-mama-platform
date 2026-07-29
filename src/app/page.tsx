"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
 const { t } = useLanguage();
 const features = getFeatures(t);
 const steps = getSteps(t);

 return (
 <>
 <Navbar />
 <main className="flex-1">
 {/* Hero Section */}
 <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-sunshine-50">
 <div className="absolute inset-0 opacity-10">
 <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
 <div className="absolute bottom-10 right-20 w-96 h-96 bg-secondary-300 rounded-full blur-3xl" />
 <div className="absolute top-40 right-40 w-48 h-48 bg-sunshine-300 rounded-full blur-3xl" />
 </div>
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
 <div className="text-center max-w-4xl mx-auto">
 <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-gray-900 leading-tight">
 {t.landing.heroTitle}{" "}
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
 {t.landing.heroHighlight}
 </span>
 </h1>
 <p className="mt-6 text-xl sm:text-2xl text-warm-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
 {t.landing.heroDescription}
 </p>
 <div className="mt-8 max-w-3xl mx-auto text-left space-y-4">
 <p className="text-warm-gray-600 leading-relaxed">{t.landing.heroBody1}</p>
 <p className="text-warm-gray-600 leading-relaxed">{t.landing.heroBody2}</p>
 <p className="text-warm-gray-600 leading-relaxed">{t.landing.heroBody3}</p>
 <p className="text-warm-gray-700 font-semibold italic">{t.landing.heroBody4}</p>
 <p className="text-warm-gray-900 font-bold text-lg">{t.landing.heroClosing}</p>
 <p className="text-primary-600 italic text-sm">{t.landing.heroCta}</p>
 </div>
 <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
 <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200">
 {t.landing.ctaPrimary}
 </Link>
 <Link href="/family-portal" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 border-2 border-primary-200 bg-white rounded-xl hover:bg-primary-50 transition-all duration-200">
 {t.landing.ctaSecondary}
 </Link>
 </div>
 <p className="mt-4 text-sm text-warm-gray-500">
 {t.landing.languageNote}
 </p>
 </div>
 </div>
 </section>

 {/* Features Section */}
 <section className="py-20 bg-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <h2 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900">
 {t.landing.featuresTitle}
 </h2>
 <p className="mt-4 text-lg text-warm-gray-600 max-w-2xl mx-auto">
 {t.landing.featuresSubtitle}
 </p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {features.map((feature) => (
 <div key={feature.title} className="p-6 rounded-2xl border border-warm-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200 group">
 <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
 <span className="text-2xl" role="img" aria-label={feature.title}>{feature.icon}</span>
 </div>
 <h3 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">{feature.title}</h3>
 <p className="text-warm-gray-600 text-sm leading-relaxed">{feature.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>
 {/* How It Works */}
 <section className="py-20 bg-gradient-to-b from-warm-gray-50 to-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <h2 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900">
 {t.landing.howItWorksTitle}
 </h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {steps.map((step, index) => (
 <div key={step.title} className="text-center">
 <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
 {index + 1}
 </div>
 <h3 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">{step.title}</h3>
 <p className="text-warm-gray-600 text-sm">{step.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
 {t.landing.ctaFinalTitle}
 </h2>
 <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
 {t.landing.ctaFinalDescription}
 </p>
 <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all duration-200">
 {t.landing.ctaFinalButton}
 </Link>
 </div>
 </section>
 </main>
 <Footer />
 </>
 );
}

const getFeatures = (t: any) => [
 { icon: "💬", iconBg: "bg-primary-100", title: t.features.aiChat, description: t.features.aiChatDesc },
 { icon: "📊", iconBg: "bg-sunshine-100", title: t.features.moodTracking, description: t.features.moodTrackingDesc },
 { icon: "🩺", iconBg: "bg-accent-100", title: t.features.epds, description: t.features.epdsDesc },
 { icon: "🚨", iconBg: "bg-red-100", title: t.features.crisis, description: t.features.crisisDesc },
 { icon: "👩\u200D👩\u200D👧", iconBg: "bg-secondary-100", title: t.features.peers, description: t.features.peersDesc },
 { icon: "📅", iconBg: "bg-earth-100", title: t.features.booking, description: t.features.bookingDesc },
];

const getSteps = (t: any) => [
 { title: t.features.step1, description: t.features.step1Desc },
 { title: t.features.step2, description: t.features.step2Desc },
 { title: t.features.step3, description: t.features.step3Desc },
];
