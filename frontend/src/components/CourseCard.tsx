'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { BookOpen, ArrowRight, Play } from '@gravity-ui/icons';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [imgSrc, setImgSrc] = useState(course.thumbnail);
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-800 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imgError ? fallbackImage : imgSrc}
          alt={course.title}
          onError={() => {
            setImgError(true);
            setImgSrc(fallbackImage);
          }}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm bg-white/95 text-indigo-700 dark:bg-slate-900/95 dark:text-indigo-300 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900">
            {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-lg">
            <Play className="h-3.5 w-3.5" />
            <span>Explore Curriculum</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span className="inline-flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <BookOpen className="h-3 w-3 text-indigo-500" />
              <span>{course.lectureCount ?? course.lectures?.length ?? 0} Lectures</span>
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {course.title}
          </h3>

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {course.price === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">Free</span>
            ) : (
              `$${course.price.toFixed(2)}`
            )}
          </div>

          <Link
            href={`/courses/${course.id || course._id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

