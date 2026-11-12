'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  GraduationCap,
  BookOpen,
  Display,
  Xmark,
} from '@gravity-ui/icons';

/**
 * Auth-dependent UI is loaded with ssr:false so it is NEVER rendered on the
 * server. This eliminates the hydration mismatch that occurs because
 * isAuthenticated depends on localStorage (server always sees false, client
 * may see true immediately on first paint).
 */
const NavbarAuthSection = dynamic(
  () => import('./NavbarAuthSection').then((m) => m.NavbarAuthSection),
  {
    ssr: false,
    // Stable placeholder rendered during the brief loading window
    loading: () => (
      <div className="h-9 w-24 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
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

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:bg-indigo-700 transition">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Edu<span className="text-indigo-600 dark:text-indigo-400">Stream</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              LMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            href="/"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive('/') && !pathname?.startsWith('/admin')
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore Courses</span>
          </Link>

          <Link
            href="/admin"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive('/admin')
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <Display className="h-4 w-4" />
            <span>Admin Dashboard</span>
          </Link>
        </nav>

        {/* User / Auth Action — client-only via dynamic(ssr:false) */}
        <div className="hidden md:flex items-center space-x-3">
          <NavbarAuthSection />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <Xmark className="h-6 w-6" /> : <Display className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <span>Explore Courses</span>
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Display className="h-4 w-4 text-indigo-600" />
            <span>Admin Dashboard</span>
          </Link>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <MobileAuthSection onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
