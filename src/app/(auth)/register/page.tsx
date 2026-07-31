"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { signUp, confirmSignUp } from "@/lib/auth/auth";
import type { UserRole } from "@/lib/auth/auth";

export default function RegisterPage() {
 const [formData, setFormData] = useState({
 name: "",
 email: "",
 phone: "",
 password: "",
 confirmPassword: "",
 role: "mother" as UserRole,
 language: "en" as "en" | "fr" | "pcm",
 consent: false,
 usePhone: false,
 });
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");
 const [showVerification, setShowVerification] = useState(false);
 const [verificationCode, setVerificationCode] = useState("");
 const { t } = useLanguage();

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
 const { name, value, type } = e.target;
 setFormData((prev) => ({
 ...prev,
 [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
 }));
 setError("");
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");

 if (formData.password !== formData.confirmPassword) {
 setError("Passwords do not match");
 return;
 }

 setIsLoading(true);
 try {
 await signUp({
 email: formData.usePhone ? undefined : formData.email,
 phone: formData.usePhone ? formData.phone : undefined,
 password: formData.password,
 name: formData.name,
 role: formData.role,
 languagePreference: formData.language,
 });
 setShowVerification(true);
 } catch (err: unknown) {
 const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
 setError(message);
 } finally {
 setIsLoading(false);
 }
 };

 const handleVerify = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");
 setIsLoading(true);
 try {
 const username = formData.usePhone ? formData.phone : formData.email;
 await confirmSignUp(username, verificationCode);
 window.location.href = "/login";
 } catch (err: unknown) {
 const message = err instanceof Error ? err.message : "Verification failed. Please try again.";
 setError(message);
 } finally {
 setIsLoading(false);
 }
 };

 // Verification code screen
 if (showVerification) {
 return (
 <>
 <Navbar />
 <main className="flex-1 flex items-center justify-center py-12 px-4">
 <div className="w-full max-w-md">
 <div className="text-center mb-8">
 <div className="w-16 h-16 mx-auto mb-4 bg-sunshine-100 rounded-full flex items-center justify-center">
 <span className="text-3xl">\u2709\uFE0F</span>
 </div>
 <h1 className="font-heading text-3xl font-bold text-warm-gray-900">Check your {formData.usePhone ? "phone" : "email"}</h1>
 <p className="mt-2 text-warm-gray-600">
 We sent a verification code to <span className="font-semibold">{formData.usePhone ? formData.phone : formData.email}</span>
 </p>
 </div>
 <form onSubmit={handleVerify} className="bg-white p-8 rounded-2xl border border-warm-gray-200 shadow-sm">
 <div className="space-y-5">
 <div>
 <label htmlFor="code" className="block text-sm font-medium text-warm-gray-700 mb-1">Verification Code</label>
 <input id="code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 text-center text-2xl tracking-widest" placeholder="000000" maxLength={6} />
 </div>
 {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
 <Button type="submit" isLoading={isLoading} className="w-full" size="lg">Verify Account</Button>
 </div>
 </form>
 </div>
 </main>
 </>
 );
 }

 return (
 <>
 <Navbar />
 <main className="flex-1 flex items-center justify-center py-12 px-4">
 <div className="w-full max-w-lg">
 <div className="text-center mb-8">
 <Image src="/logo.jpeg" alt="ThrivingMama" width={64} height={64} className="w-16 h-16 mx-auto mb-4 rounded-full object-cover" />
 <h1 className="font-heading text-3xl font-bold text-warm-gray-900">{t.auth.joinTitle}</h1>
 <p className="mt-2 text-warm-gray-600">{t.auth.joinSubtext}</p>
 </div>
 <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-warm-gray-200 shadow-sm">
 <div className="space-y-5">
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.fullName}</label>
 <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800" />
 </div>

 {/* Toggle: email or phone */}
 <div className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-xl">
 <button type="button" onClick={() => setFormData(p => ({...p, usePhone: false}))} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!formData.usePhone ? "bg-white shadow-sm text-primary-600" : "text-warm-gray-500"}`}>Email</button>
 <button type="button" onClick={() => setFormData(p => ({...p, usePhone: true}))} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.usePhone ? "bg-white shadow-sm text-primary-600" : "text-warm-gray-500"}`}>Phone</button>
 </div>

 {!formData.usePhone ? (
 <div>
 <label htmlFor="email" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.email}</label>
 <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800" />
 </div>
 ) : (
 <div>
 <label htmlFor="phone" className="block text-sm font-medium text-warm-gray-700 mb-1">Phone Number</label>
 <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+237..." className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800" />
 <p className="text-xs text-warm-gray-400 mt-1">Include country code (e.g. +237 for Cameroon)</p>
 </div>
 )}

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label htmlFor="role" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.iAmA}</label>
 <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 bg-white">
 <option value="mother">{t.auth.mother}</option>
 <option value="counselor">{t.auth.counselor}</option>
 </select>
 </div>
 <div>
 <label htmlFor="language" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.preferredLanguage}</label>
 <select id="language" name="language" value={formData.language} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 bg-white">
 <option value="en">English</option>
 <option value="fr">Fran\u00E7ais</option>
 <option value="pcm">Pidgin English</option>
 </select>
 </div>
 </div>

 <div>
 <label htmlFor="password" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.password}</label>
 <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800" />
 </div>
 <div>
 <label htmlFor="confirmPassword" className="block text-sm font-medium text-warm-gray-700 mb-1">{t.auth.confirmPassword}</label>
 <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800" />
 </div>

 <div className="flex items-start gap-3">
 <input id="consent" name="consent" type="checkbox" checked={formData.consent} onChange={handleChange} required className="mt-1 w-4 h-4 rounded border-warm-gray-300 text-primary-500 focus:ring-primary-400" />
 <label htmlFor="consent" className="text-sm text-warm-gray-600">{t.auth.consent}</label>
 </div>

 {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

 <Button type="submit" isLoading={isLoading} className="w-full" size="lg">{t.auth.createAccount}</Button>
 </div>
 </form>
 <p className="mt-6 text-center text-sm text-warm-gray-600">
 {t.auth.haveAccount}{" "}
 <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">{t.auth.signInLink}</Link>
 </p>
 </div>
 </main>
 </>
 );
}
