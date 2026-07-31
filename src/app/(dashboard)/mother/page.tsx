"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

export default function MotherDashboard() {
 const { t } = useLanguage();
 const { user } = useAuth();

 return (
 <div>
 <div className="mb-8">
 <h1 className="font-heading text-3xl font-bold text-warm-gray-900">
 {t.mother.dashboardGreeting}, {user?.name || ""}
 </h1>
 <p className="mt-1 text-warm-gray-600">{t.mother.dashboardSubtext}</p>
 </div>
 {/* Quick Actions */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
 <Link href="/mother/chat">
 <Card className="hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
 <span className="text-2xl">💬</span>
 </div>
 <div>
 <h3 className="font-semibold text-warm-gray-800">{t.mother.chatTitle}</h3>
 <p className="text-sm text-warm-gray-500">{t.nav.aiCoach}</p>
 </div>
 </div>
 </Card>
 </Link>
 <Link href="/mother/mood">
 <Card className="hover:border-sunshine-300 hover:shadow-md transition-all cursor-pointer group">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-sunshine-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
 <span className="text-2xl">📊</span>
 </div>
 <div>
 <h3 className="font-semibold text-warm-gray-800">{t.mother.moodTitle}</h3>
 <p className="text-sm text-warm-gray-500">{t.nav.mood}</p>
 </div>
 </div>
 </Card>
 </Link>
 <Link href="/mother/booking">
 <Card className="hover:border-accent-300 hover:shadow-md transition-all cursor-pointer group">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
 <span className="text-2xl">📅</span>
 </div>
 <div>
 <h3 className="font-semibold text-warm-gray-800">{t.mother.bookingTitle}</h3>
 <p className="text-sm text-warm-gray-500">{t.nav.bookSession}</p>
 </div>
 </div>
 </Card>
 </Link>
 </div>
 {/* Status Cards */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <Card>
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-heading text-lg font-bold text-warm-gray-800">{t.mother.moodTitle}</h3>
 <Link href="/mother/mood" className="text-sm text-primary-600 hover:text-primary-700 font-medium">{t.common.viewAll}</Link>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex gap-1">
 {["😊", "😔", "😔", "😊", "😊", "😊", "😔"].map((emoji, i) => (
 <span key={i} className="text-2xl">{emoji}</span>
 ))}
 </div>
 </div>
 </Card>
 <Card>
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-heading text-lg font-bold text-warm-gray-800">{t.mother.bookingTitle}</h3>
 <Link href="/mother/booking" className="text-sm text-primary-600 hover:text-primary-700 font-medium">{t.common.viewAll}</Link>
 </div>
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
 <span className="text-lg font-bold text-accent-700">NA</span>
 </div>
 <div>
 <p className="font-semibold text-warm-gray-800">Dr. Ngozi Adeyemi</p>
 <p className="text-sm text-warm-gray-500">June 18, 2026 at 9:00 AM</p>
 </div>
 </div>
 </Card>
 <Card className="border-sunshine-200 bg-sunshine-50">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-sunshine-200 rounded-xl flex items-center justify-center">
 <span className="text-2xl">🩺</span>
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-warm-gray-800">{t.mother.epdsTitle}</h3>
 <p className="text-sm text-warm-gray-600">{t.nav.screening}</p>
 </div>
 <Link href="/mother/epds" className="px-4 py-2 bg-sunshine-500 text-white rounded-lg text-sm font-semibold hover:bg-sunshine-600 transition-colors">{t.common.next}</Link>
 </div>
 </Card>
 <Card>
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-heading text-lg font-bold text-warm-gray-800">{t.mother.peersTitle}</h3>
 <Link href="/mother/peers" className="text-sm text-primary-600 hover:text-primary-700 font-medium">{t.common.viewAll}</Link>
 </div>
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
 <span className="text-sm font-bold text-secondary-700">FN</span>
 </div>
 <div className="flex-1">
 <p className="font-medium text-warm-gray-800">Fatima N.</p>
 <p className="text-sm text-warm-gray-500 truncate">How was your night?</p>
 </div>
 <span className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
 </div>
 </Card>
 </div>
 </div>
 );
}
