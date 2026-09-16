"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { UserRole } from "@/lib/mock-data/users";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

interface NavbarProps {
  userRole?: UserRole;
  userName?: string;
}

export default function Navbar({ userRole, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { logout } = useAuth();

  const getNavLinks = () => {
    if (!userRole) {
      return [
        { href: "/", label: t.nav.home },
        { href: "/family-portal", label: t.nav.familyPortal },
 { href: "/about", label: t.nav.about },
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
            <Image src="/logo.jpeg" alt="ThrivingMama Logo" width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
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
            {userRole && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-warm-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm font-semibold">
                    {(userName || "M").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-warm-gray-700">
                    {userName ? userName.split(" ")[0] : ""}
                  </span>
                  <svg className={`w-4 h-4 text-warm-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    {/* Backdrop to close on outside click */}
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-warm-gray-100 bg-white shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-warm-gray-100">
                        <p className="text-xs text-warm-gray-400">{t.common.greeting}</p>
                        <p className="text-sm font-semibold text-warm-gray-800 truncate">{userName || "Mama"}</p>
                      </div>
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
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
            {userRole && (
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 mt-2 border-t border-warm-gray-100 pt-3"
              >
                Log out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
