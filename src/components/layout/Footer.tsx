"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
 const { t } = useLanguage();

 return (
 <footer className="bg-warm-gray-800 text-warm-gray-300 mt-auto">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
 <div className="col-span-1 md:col-span-2">
 <div className="flex items-center gap-2 mb-4">
 <Image src="/logo.jpeg" alt="ThrivingMama" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
 <span className="font-heading text-lg font-bold text-white">ThrivingMama</span>
 </div>
 <p className="text-sm text-warm-gray-400 max-w-sm">{t.footer.description}</p>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t.footer.platform}</h3>
 <ul className="space-y-2">
 <li><Link href="/family-portal" className="text-sm hover:text-primary-300 transition-colors">{t.nav.familyPortal}</Link></li>
 <li><Link href="/about" className="text-sm hover:text-primary-300 transition-colors">{t.nav.about}</Link></li>
 <li><Link href="/register" className="text-sm hover:text-primary-300 transition-colors">{t.nav.getStarted}</Link></li>
 <li><Link href="/login" className="text-sm hover:text-primary-300 transition-colors">{t.nav.signIn}</Link></li>
 </ul>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t.footer.crisisSupport}</h3>
 <ul className="space-y-2">
 <li className="text-sm">Emergency: <span className="text-primary-300 font-semibold">112</span></li>
 <li className="text-sm">Crisis Line: <span className="text-primary-300 font-semibold">988</span></li>
 <li className="text-sm text-warm-gray-400">{t.footer.available247}</li>
 </ul>
 </div>
 </div>
 <div className="border-t border-warm-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
 <p className="text-xs text-warm-gray-500">\u00A9 {new Date().getFullYear()} {t.footer.copyright}</p>
 <div className="flex gap-4">
 <Link href="#" className="text-xs text-warm-gray-500 hover:text-warm-gray-300">Privacy Policy</Link>
 <Link href="#" className="text-xs text-warm-gray-500 hover:text-warm-gray-300">Terms of Service</Link>
 </div>
 </div>
 </div>
 </footer>
 );
}
