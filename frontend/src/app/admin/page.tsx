'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Course } from '@/types';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CourseModal from '@/components/admin/CourseModal';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import {
  Display,
  Plus,
  Pencil,
  TrashBin,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Magnifier,
  Play,
} from '@gravity-ui/icons';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auth Protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourses();
      if (res.success && res.data) {
        setCourses(res.data);
      } else {
        setError(res.message || 'Failed to fetch courses from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCourses();
    }
  }, [isAuthenticated]);

  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (data: {
    title: string;
    description: string;
    price: number;
    thumbnail: string;
  }) => {
    if (editingCourse) {
      const res = await updateCourse(editingCourse.id || editingCourse._id, data);
      if (!res.success) {
        throw new Error(res.message || 'Failed to update course');
      }
    } else {
      const res = await createCourse(data);
      if (!res.success) {
        throw new Error(res.message || 'Failed to create course');
      }
    }
    await loadCourses();
  };

  const handleOpenDeleteModal = (course: Course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteCourse(courseToDelete.id || courseToDelete._id);
      if (res.success) {
        setDeleteModalOpen(false);
        setCourseToDelete(null);
        await loadCourses();
      } else {
        alert(res.message || 'Failed to delete course');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred while deleting course');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLectures = courses.reduce(
    (acc, curr) => acc + (curr.lectureCount || curr.lectures?.length || 0),
    0
  );

  if (authLoading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center text-xs text-slate-500">Checking admin session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header bar */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                <Display className="h-4 w-4" />
                <span>Admin Operations</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Course Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Create, update, manage curriculum lectures, and delete courses.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                <span>View Student Panel</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Courses
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {courses.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Lectures
              </span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {totalLectures}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Paid Courses
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {courses.filter((c) => c.price > 0).length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Free Courses
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {courses.filter((c) => c.price === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search */}
        <div className="flex items-center justify-between pb-6">
          <div className="relative w-full max-w-sm">
            <Magnifier className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter courses by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full animate-pulse rounded-2xl bg-white p-4 border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredCourses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <GraduationCap className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              No courses found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Get started by adding your first course to the platform.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Course</span>
            </button>
          </div>
        )}

        {/* Courses Table / Cards */}
        {!loading && filteredCourses.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <th className="py-3.5 pl-6 pr-3">Course</th>
                    <th className="px-3 py-3.5">Price</th>
                    <th className="px-3 py-3.5">Lectures</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredCourses.map((course) => {
                    const courseId = course.id || course._id;
                    const lectureCount =
                      course.lectureCount ?? course.lectures?.length ?? 0;

                    return (
                      <tr
                        key={courseId}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-4 pl-6 pr-3">
                          <div className="flex items-center space-x-3.5">
                            <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 dark:border-slate-800">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80';
                                }}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="max-w-md">
                              <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {course.title}
                              </span>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {course.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-4 font-bold text-slate-900 dark:text-slate-100">
                          {course.price === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                          ) : (
                            `$${course.price.toFixed(2)}`
                          )}
                        </td>

                        <td className="px-3 py-4">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                            <BookOpen className="h-3 w-3" />
                            <span>{lectureCount} lectures</span>
                          </span>
                        </td>

                        <td className="py-4 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/courses/${courseId}/lectures`}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 transition"
                            >
                              <Play className="h-3 w-3" />
                              <span>Lectures ({lectureCount})</span>
                            </Link>

                            <button
                              onClick={() => handleOpenEditModal(course)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Edit Course"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleOpenDeleteModal(course)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Delete Course"
                            >
                              <TrashBin className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Course Create/Edit Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCourse}
        course={editingCourse}
      />

      {/* Course Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${courseToDelete?.title}"? This will permanently delete the course and all associated lectures from MongoDB.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}

