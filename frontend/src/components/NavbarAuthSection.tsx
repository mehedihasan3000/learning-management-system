'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Person } from '@gravity-ui/icons';

/**
 * Desktop auth controls — client-rendered (ssr: false) to prevent hydration divergence.
 */
export function NavbarAuthSection() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        {/* Compact Admin Identifier: Icon + "Admin" */}
        <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Person className="h-2.5 w-2.5" />
          </span>
          <span className="font-medium tracking-tight">Admin</span>
        </div>

        {/* Minimal Sign Out action */}
        <button
          onClick={() => logout()}
          title="Sign out of admin session"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <span>Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/admin/login"
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-800 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-850 dark:hover:text-white"
    >
      <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
      <span>Admin Login</span>
    </Link>
  );
}

/**
 * Mobile drawer auth controls.
 */
export function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-between py-1">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Person className="h-3 w-3" />
          </span>
          <span>Admin</span>
        </div>
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/admin/login"
      onClick={onClose}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-800 shadow-2xs transition hover:bg-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Lock className="h-3.5 w-3.5 text-slate-400" />
      <span>Admin Login</span>
    </Link>
  );
}
