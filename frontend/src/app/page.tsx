'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { getCourses } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import {
  GraduationCap,
  Magnifier,
  BookOpen,
  ArrowRight,
  CircleCheck,
  Display,
} from '@gravity-ui/icons';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourses();
      if (res.success && res.data) {
        setCourses(res.data);
      } else {
        setError(res.message || 'Failed to fetch courses from backend API.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error connecting to API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  // Filter & Search
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'free') return c.price === 0;
    if (filterType === 'paid') return c.price > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-24 dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/60 via-transparent to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/10 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>Interactive Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Level Up Your Skills with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Expert-Led Video Courses
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Explore industry-standard curriculums, stream high-definition lectures, and build
            real-world competencies at your own pace.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="#course-catalog"
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse Catalog</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Display className="h-4 w-4" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <main id="course-catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Available Courses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing {filteredCourses.length} of {courses.length} courses loaded from MongoDB
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Magnifier className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex rounded-xl bg-slate-200/80 p-1 dark:bg-slate-800">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filterType === 'all'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('paid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filterType === 'paid'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilterType('free')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filterType === 'free'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Free
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/60 dark:bg-rose-950/40">
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">
              Unable to load courses
            </h3>
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
            <button
              onClick={fetchCourseData}
              className="mt-4 inline-flex items-center space-x-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition"
            >
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="aspect-video w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="pt-4 flex justify-between">
                  <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              No courses found
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `No courses match your search "${searchQuery}". Try a different keyword.`
                : 'No courses have been created yet. Log into the Admin Dashboard to add the first course!'}
            </p>
            {!searchQuery && (
              <Link
                href="/admin"
                className="mt-5 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
              >
                <Display className="h-4 w-4" />
                <span>Go to Admin Dashboard</span>
              </Link>
            )}
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id || course._id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
