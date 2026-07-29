"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LoginPage() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const { t } = useLanguage();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsLoading(true);
 setTimeout(() => { setIsLoading(false); window.location.href = "/mother"; }, 1500);
 };

 return (
 <>
 <Navbar />
 <main className="flex-1 flex items-center justify-center py-12 px-4">
 <div className="w-full max-w-md">
 <div className="text-center mb-8">
 <Image src="/logo.jpeg" alt="ThrivingMama" width={64} height={64} className="w-16 h-16 mx-auto mb-4 rounded-full object-cover" />
 <h1 className="font-heading text-3xl font-bold text-warm-gray-900">{t.auth.welcomeBack}</h1>
 <p className="mt-2 text-warm-gray-600">{t.auth.signInSubtext}</p>
 </div>
 <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-warm-gray-200 shadow-sm">
 <div className="space-y-5">
 <div>
 <label htmlFor="email" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.email}</label>
 <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400" placeholder="you@example.com" />
 </div>
 <div>
 <label htmlFor="password" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.password}</label>
 <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400" />
 </div>
 <Button type="submit" isLoading={isLoading} className="w-full" size="lg">{t.auth.signIn}</Button>
 </div>
 </form>
 <p className="mt-6 text-center text-sm text-warm-gray-600">
 {t.auth.noAccount}{" "}
 <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">{t.auth.createHere}</Link>
 </p>
 </div>
 </main>
 </>
 );
}
