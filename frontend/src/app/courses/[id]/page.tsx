'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Course, Lecture } from '@/types';
import { getCourseById } from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Clock,
  CircleCheck,
  Video,
} from '@gravity-ui/icons';

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCourseById(id);
        if (res.success && res.data) {
          setCourse(res.data);
          const lectures = res.data.lectures || [];
          if (lectures.length > 0) {
            setActiveLecture(lectures[0]);
          }
        } else {
          setError(res.message || 'Course not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch course details.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const lectures = course?.lectures || [];
  const currentIndex = activeLecture
    ? lectures.findIndex((l) => (l.id || l._id) === (activeLecture.id || activeLecture._id))
    : -1;

  const handleNextLecture = () => {
    if (currentIndex >= 0 && currentIndex < lectures.length - 1) {
      setActiveLecture(lectures[currentIndex + 1]);
    }
  };

  const handlePrevLecture = () => {
    if (currentIndex > 0) {
      setActiveLecture(lectures[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-800" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950">
            <Video className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            {error || 'Course Not Found'}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            The course you requested may have been removed or the ID is invalid.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Course Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Breadcrumb / Bar */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Courses</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {course.title}
            </span>
            <span>•</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video & Details (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {activeLecture ? (
              <VideoPlayer url={activeLecture.videoUrl} title={activeLecture.title} />
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-slate-400">
                <Video className="h-12 w-12 text-slate-600 mb-2" />
                <p className="text-sm font-medium">No lectures available for this course yet.</p>
              </div>
            )}

            {/* Lecture Header & Navigation Controls */}
            {activeLecture && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Lecture {activeLecture.order || currentIndex + 1} of {lectures.length}
                    </span>
                    <h1 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                      {activeLecture.title}
                    </h1>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevLecture}
                      disabled={currentIndex <= 0}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextLecture}
                      disabled={currentIndex < 0 || currentIndex >= lectures.length - 1}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition"
                    >
                      Next Lecture
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Lecture Description
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {activeLecture.description}
                  </p>
                </div>
              </div>
            )}

            {/* Course Overview Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">About This Course</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <span>
                    <strong>{lectures.length}</strong> Total Lectures
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
                  <CircleCheck className="h-4 w-4 text-emerald-500" />
                  <span>Embedded High-Definition Streaming</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Curriculum Playlist (1 column on lg) */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Course Curriculum
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {lectures.length} Lessons
                </span>
              </div>

              {lectures.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No lectures have been added to this course yet.
                </div>
              ) : (
                <div className="mt-3 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {lectures.map((lecture, index) => {
                    const isSelected =
                      (activeLecture?.id || activeLecture?._id) === (lecture.id || lecture._id);

                    return (
                      <button
                        key={lecture.id || lecture._id}
                        onClick={() => setActiveLecture(lecture)}
                        className={`w-full text-left p-3 rounded-xl transition flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-200'
                            : 'hover:bg-slate-50 border border-transparent dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {isSelected ? <Play className="h-3.5 w-3.5 fill-current" /> : index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {lecture.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                            {lecture.duration && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{lecture.duration}</span>
                              </span>
                            )}
                            {isSelected && (
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                • Playing Now
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Course Summary Card */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 shadow-md">
              <h4 className="text-sm font-bold tracking-tight">Ready to expand your learning?</h4>
              <p className="mt-1 text-xs text-indigo-200">
                Browse our full catalog of high-demand development and architecture courses.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center space-x-2 rounded-xl bg-white text-indigo-950 px-4 py-2 text-xs font-bold hover:bg-indigo-50 transition"
              >
                <span>Explore More Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

