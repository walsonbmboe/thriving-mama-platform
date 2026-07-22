"use client";

import Link from "next/link";
import { useState } from "react";
import { UserRole } from "@/lib/mock-data/users";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface NavbarProps {
  userRole?: UserRole;
  userName?: string;
}

export default function Navbar({ userRole, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const getNavLinks = () => {
    if (!userRole) {
      return [
        { href: "/", label: t.nav.home },
        { href: "/family-portal", label: t.nav.familyPortal },
        { href: "/login", label: t.nav.signIn },
        { href: "/register", label: t.nav.getStarted },
      ];
    }

    if (userRole === "mother") {
      return [
        { href: "/mother", label: t.nav.dashboard },
        { href: "/mother/chat", label: t.nav.aiCoach },
        { href: "/mother/mood", label: t.nav.mood },
        { href: "/mother/epds", label: t.nav.screening },
        { href: "/mother/booking", label: t.nav.bookSession },
        { href: "/mother/peers", label: t.nav.peers },
      ];
    }

    if (userRole === "counselor") {
      return [
        { href: "/counselor", label: t.nav.dashboard },
        { href: "/counselor", label: t.nav.sessions },
        { href: "/counselor", label: t.nav.referrals },
      ];
    }

    return [
      { href: "/admin", label: t.nav.dashboard },
      { href: "/admin", label: t.nav.users },
      { href: "/admin", label: t.nav.analytics },
    ];
  };

  const links = getNavLinks();

  return (
    <nav className="bg-white border-b border-warm-gray-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href={userRole ? `/${userRole === "mother" ? "mother" : userRole}` : "/"} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <span className="font-heading text-xl font-bold text-warm-gray-800">
              Thriving<span className="text-primary-500">Mama</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-warm-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User info + language switcher + mobile toggle */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {userName && (
              <span className="hidden sm:block text-sm text-warm-gray-500">
                {t.common.greeting}, <span className="font-semibold text-warm-gray-700">{userName.split(" ")[0]}</span>
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-warm-gray-600 hover:bg-warm-gray-100"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-warm-gray-100 mt-2 pt-3">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-base font-medium text-warm-gray-600 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
