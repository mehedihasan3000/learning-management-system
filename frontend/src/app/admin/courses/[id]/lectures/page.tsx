'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Course, Lecture } from '@/types';
import {
  getCourseById,
  createLecture,
  updateLecture,
  deleteLecture,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LectureModal from '@/components/admin/LectureModal';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import VideoPlayer from '@/components/VideoPlayer';
import {
  ArrowLeft,
  Plus,
  Pencil,
  TrashBin,
  Video,
  Clock,
  Play,
  Xmark,
} from '@gravity-ui/icons';

export default function AdminLectureManagementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Video Preview Modal
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadData = async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getCourseById(courseId);
      if (res.success && res.data) {
        setCourse(res.data);
        setLectures(res.data.lectures || []);
      } else {
        setError(res.message || 'Failed to load course details.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && courseId) {
      loadData();
    }
  }, [isAuthenticated, courseId]);

  const handleOpenCreateModal = () => {
    setEditingLecture(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setIsModalOpen(true);
  };

  const handleSaveLecture = async (data: {
    title: string;
    description: string;
    videoUrl: string;
    order?: number;
    duration?: string;
  }) => {
    if (editingLecture) {
      const res = await updateLecture(editingLecture.id || editingLecture._id, data);
      if (!res.success) {
        throw new Error(res.message || 'Failed to update lecture');
      }
    } else {
      const res = await createLecture(courseId, data);
      if (!res.success) {
        throw new Error(res.message || 'Failed to add lecture');
      }
    }
    await loadData();
  };

  const handleOpenDeleteModal = (lecture: Lecture) => {
    setLectureToDelete(lecture);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!lectureToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteLecture(lectureToDelete.id || lectureToDelete._id);
      if (res.success) {
        setDeleteModalOpen(false);
        setLectureToDelete(null);
        await loadData();
      } else {
        alert(res.message || 'Failed to delete lecture');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred while deleting lecture');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center text-xs text-slate-500">Checking admin session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Banner & Breadcrumb */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Courses</span>
          </Link>
        </div>

        {course && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200 dark:border-slate-800">
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
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Managing Curriculum
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {course.title}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lectures.length} Total Lectures in Database
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href={`/courses/${courseId}`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Preview as Student</span>
                </Link>
                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Lecture</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-2xl bg-white p-4 border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
              />
            ))}
          </div>
        )}

        {!loading && lectures.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Video className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              No lectures added yet
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Add lessons with embedded video URLs so students can start streaming this course.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Lecture</span>
            </button>
          </div>
        )}

        {!loading && lectures.length > 0 && (
          <div className="space-y-3">
            {lectures.map((lecture, index) => {
              const lectureId = lecture.id || lecture._id;

              return (
                <div
                  key={lectureId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-xs text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      #{lecture.order || index + 1}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lecture.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 max-w-xl">
                        {lecture.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-3 text-[11px] text-slate-400">
                        {lecture.duration && (
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{lecture.duration}</span>
                          </span>
                        )}
                        <span className="truncate max-w-xs font-mono text-slate-400">
                          {lecture.videoUrl}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() =>
                        setPreviewVideo({ url: lecture.videoUrl, title: lecture.title })
                      }
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                    >
                      <Play className="h-3 w-3 text-indigo-600" />
                      <span>Watch</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(lecture)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Lecture"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleOpenDeleteModal(lecture)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Delete Lecture"
                    >
                      <TrashBin className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Lecture Modal */}
      <LectureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveLecture}
        lecture={editingLecture}
        defaultOrder={lectures.length + 1}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setLectureToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Lecture"
        message={`Are you sure you want to delete "${lectureToDelete?.title}"? This cannot be undone.`}
        isDeleting={isDeleting}
      />

      {/* Quick Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 p-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm font-bold text-white truncate max-w-md">
                {previewVideo.title}
              </h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <Xmark className="h-5 w-5" />
              </button>
            </div>
            <VideoPlayer url={previewVideo.url} title={previewVideo.title} />
          </div>
        </div>
      )}
    </div>
  );
}

