"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
 const { t } = useLanguage();

 return (
 <>
 <Navbar />
 <main className="flex-1">
 {/* Hero */}
 <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-sunshine-50">
 <div className="absolute inset-0 opacity-10">
 <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
 <div className="absolute bottom-10 right-20 w-96 h-96 bg-secondary-300 rounded-full blur-3xl" />
 </div>
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
 <div className="text-center max-w-3xl mx-auto">
 <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-gray-900 leading-tight">
 {t.about.title}
 </h1>
 <p className="mt-6 text-lg sm:text-xl text-warm-gray-600 leading-relaxed italic">
 {t.about.subtitle}
 </p>
 </div>
 </div>
 </section>

 {/* Founder Section */}
 <section className="py-20 bg-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div className="flex justify-center">
 <div className="relative">
 <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
 <Image src="/sharon.jpeg" alt="Sharon Teburg - Founder of ThrivingMama" fill className="object-cover" priority />
 </div>
 <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl opacity-20" />
 </div>
 </div>
 <div>
 <h2 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900 mb-6">
 {t.about.founderTitle}
 </h2>
 <p className="text-lg text-warm-gray-600 leading-relaxed mb-6">
 {t.about.founderBio}
 </p>
 <div className="flex items-center gap-3">
 <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full" />
 <span className="text-primary-600 font-semibold">{t.about.founderName}</span>
 </div>
 </div>
 </div>
 </div>
 </section>
 {/* Story Section */}
 <section className="py-20 bg-gradient-to-b from-warm-gray-50 to-white">
 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
 <h2 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900 mb-12 text-center">
 {t.about.visionTitle}
 </h2>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
 <div className="lg:col-span-1 flex justify-center">
 <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
 <Image src="/sharon1.jpeg" alt="Sharon Teburg speaking about maternal mental health" width={256} height={320} className="object-cover w-full h-full" />
 </div>
 </div>
 <div className="lg:col-span-2">
 <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-warm-gray-100">
 <p className="text-lg text-warm-gray-600 leading-relaxed mb-8">
 {t.about.visionText}
 </p>
 <blockquote className="border-l-4 border-primary-400 pl-6 py-2">
 <p className="text-warm-gray-700 italic text-lg">
 {t.about.ctaText}
 </p>
 <footer className="mt-3 text-primary-600 font-semibold">
 \u2014 {t.about.founderName}
 </footer>
 </blockquote>
 </div>
 </div>
 </div>
 </div>
 </section>
 {/* Mission Section */}
 <section className="py-20 bg-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-12">
 <h2 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900 mb-4">
 {t.about.missionTitle}
 </h2>
 <p className="text-lg text-warm-gray-600 max-w-3xl mx-auto">
 {t.about.missionText}
 </p>
 </div>
 <div className="text-center mb-16">
 <h3 className="font-heading text-2xl font-bold text-warm-gray-900">
 {t.about.valuesTitle}
 </h3>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
 <div className="text-center p-6 rounded-2xl bg-primary-50 border border-primary-100">
 <div className="w-14 h-14 mx-auto mb-4 bg-primary-200 rounded-full flex items-center justify-center">
 <span className="text-2xl">💬</span>
 </div>
 <h4 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">{t.about.valueCompassion}</h4>
 <p className="text-sm text-warm-gray-600">{t.about.valueCompassionDesc}</p>
 </div>
 <div className="text-center p-6 rounded-2xl bg-secondary-50 border border-secondary-100">
 <div className="w-14 h-14 mx-auto mb-4 bg-secondary-200 rounded-full flex items-center justify-center">
 <span className="text-2xl">📚</span>
 </div>
 <h4 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">{t.about.valueCulture}</h4>
 <p className="text-sm text-warm-gray-600">{t.about.valueCultureDesc}</p>
 </div>
 <div className="text-center p-6 rounded-2xl bg-sunshine-50 border border-sunshine-100">
 <div className="w-14 h-14 mx-auto mb-4 bg-sunshine-200 rounded-full flex items-center justify-center">
 <span className="text-2xl">🤝</span>
 </div>
 <h4 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">{t.about.valueCommunity}</h4>
 <p className="text-sm text-warm-gray-600">{t.about.valueCommunityDesc}</p>
 </div>
 <div className="text-center p-6 rounded-2xl bg-earth-50 border border-earth-100">
 <div className="w-14 h-14 mx-auto mb-4 bg-earth-200 rounded-full flex items-center justify-center">
 <span className="text-2xl">🌍</span>
 </div>
 <h4 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">{t.about.valueAccessibility}</h4>
 <p className="text-sm text-warm-gray-600">{t.about.valueAccessibilityDesc}</p>
 </div>
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
 {t.about.ctaTitle}
 </h2>
 <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto italic">
 {t.about.ctaText}
 </p>
 <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all duration-200">
 {t.about.ctaButton}
 </Link>
 </div>
 </section>
 </main>
 <Footer />
 </>
 );
}
