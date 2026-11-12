'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  GraduationCap,
  Bars,
  Xmark,
} from '@gravity-ui/icons';

const NavbarAuthSection = dynamic(
  () => import('./NavbarAuthSection').then((m) => m.NavbarAuthSection),
  {
    ssr: false,
    loading: () => (
      <div className="h-7 w-20 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
    ),
  }
);

const MobileAuthSection = dynamic(
  () => import('./NavbarAuthSection').then((m) => m.MobileAuthSection),
  { ssr: false }
);

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCoursesActive = pathname === '/' || pathname?.startsWith('/courses');
  const isAdminActive = pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity (LMS badge removed) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs dark:bg-indigo-500">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            EduStream
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          <Link
            href="/"
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              isCoursesActive && !isAdminActive
                ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:bg-slate-800 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-slate-200'
            }`}
          >
            Explore Courses
          </Link>

          <Link
            href="/admin"
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              isAdminActive
                ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:bg-slate-800 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-slate-200'
            }`}
          >
            Admin Dashboard
          </Link>
        </nav>

        {/* Right: Auth Action (Icon + "Admin" or "Admin Login") */}
        <div className="hidden md:flex items-center">
          <NavbarAuthSection />
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <Xmark className="h-4 w-4" /> : <Bars className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-950/95 space-y-2">
          <nav className="flex flex-col gap-1 text-xs font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-md px-3 py-2 transition ${
                isCoursesActive && !isAdminActive
                  ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'
              }`}
            >
              Explore Courses
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-md px-3 py-2 transition ${
                isAdminActive
                  ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'
              }`}
            >
              Admin Dashboard
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
            <MobileAuthSection onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
