"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "mother" as "mother" | "counselor",
    language: "en" as "en" | "fr" | "pcm",
    consent: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/mother";
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">TM</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-warm-gray-900">
              Join ThrivingMama
            </h1>
            <p className="mt-2 text-warm-gray-600">
              Start your journey to better mental health
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-warm-gray-200 shadow-sm">
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-warm-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-warm-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-warm-gray-700 mb-1">
                    I am a
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 bg-white"
                  >
                    <option value="mother">Mother</option>
                    <option value="counselor">Counselor</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-warm-gray-700 mb-1">
                    Preferred Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 bg-white"
                  >
                    <option value="en">English</option>
                    <option value="fr">Fran\u00e7ais</option>
                    <option value="pcm">Pidgin English</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-warm-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400"
                  placeholder="Min 8 chars, uppercase, lowercase, number"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-warm-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400"
                  placeholder="Repeat your password"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 rounded border-warm-gray-300 text-primary-500 focus:ring-primary-400"
                />
                <label htmlFor="consent" className="text-sm text-warm-gray-600">
                  I consent to the storage and use of my conversation history, mood data, and screening results
                  to provide personalized support. I can withdraw consent at any time.
                </label>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
                Create My Account
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-warm-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
