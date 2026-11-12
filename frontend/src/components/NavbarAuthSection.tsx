'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Person, ArrowRight } from '@gravity-ui/icons';

/** Desktop auth buttons — rendered only on the client (ssr: false) */
export function NavbarAuthSection() {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 flex items-center justify-center font-semibold text-xs border border-indigo-300 dark:border-indigo-700">
            <Person className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Admin Active
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/admin/login"
      className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 transition shadow-sm"
    >
      <Lock className="h-3.5 w-3.5" />
      <span>Admin Login</span>
      <ArrowRight className="h-3 w-3" />
    </Link>
  );
}

/** Mobile auth section — rendered only on the client (ssr: false) */
export function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs text-slate-600 dark:text-slate-400">
          Logged in as <b>{user?.email}</b>
        </span>
        <button
          onClick={() => { logout(); onClose(); }}
          className="text-xs text-rose-600 font-semibold"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/admin/login"
      onClick={onClose}
      className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
    >
      <Lock className="h-4 w-4" />
      <span>Admin Login</span>
    </Link>
  );
}

