import React from 'react';
import Link from 'next/link';
import { GraduationCap } from '@gravity-ui/icons';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">EduStream LMS</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full-Stack Learning Management System Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 transition">
              Student Catalog
            </Link>
            <Link href="/admin" className="hover:text-indigo-600 transition">
              Admin Portal
            </Link>
            <Link href="/admin/login" className="hover:text-indigo-600 transition">
              Sign In
            </Link>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 EduStream LMS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
