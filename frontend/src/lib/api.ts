import { Course, Lecture, AdminUser, ApiResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Universal API request wrapper.
 * Always includes credentials: 'include' so secure HttpOnly session cookies
 * are automatically sent with all requests, completely removing the need
 * for storing sensitive JWT tokens in browser localStorage.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}`,
        error: data.error,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Network error occurred. Is the backend server running?',
    };
  }
}

// ==========================================
// Course APIs (100% Real MongoDB Data)
// ==========================================

export async function getCourses(): Promise<ApiResponse<Course[]>> {
  return apiRequest<Course[]>('/courses');
}

export async function getCourseById(id: string): Promise<ApiResponse<Course>> {
  return apiRequest<Course>(`/courses/${id}`);
}

export async function createCourse(data: {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}): Promise<ApiResponse<Course>> {
  return apiRequest<Course>('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    thumbnail: string;
  }>
): Promise<ApiResponse<Course>> {
  return apiRequest<Course>(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/courses/${id}`, {
    method: 'DELETE',
  });
}

// ==========================================
// Lecture APIs (100% Real MongoDB Data)
// ==========================================

export async function getLecturesByCourse(courseId: string): Promise<ApiResponse<Lecture[]>> {
  return apiRequest<Lecture[]>(`/courses/${courseId}/lectures`);
}

export async function getLectureById(id: string): Promise<ApiResponse<Lecture>> {
  return apiRequest<Lecture>(`/lectures/${id}`);
}

export async function createLecture(
  courseId: string,
  data: {
    title: string;
    description: string;
    videoUrl: string;
    order?: number;
    duration?: string;
  }
): Promise<ApiResponse<Lecture>> {
  return apiRequest<Lecture>(`/courses/${courseId}/lectures`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLecture(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    videoUrl: string;
    order: number;
    duration: string;
  }>
): Promise<ApiResponse<Lecture>> {
  return apiRequest<Lecture>(`/lectures/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLecture(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/lectures/${id}`, {
    method: 'DELETE',
  });
}

// ==========================================
// Admin Auth APIs (HttpOnly Cookie Session)
// ==========================================

export async function loginAdminApi(
  email: string,
  password: string
): Promise<ApiResponse<{ admin: AdminUser }>> {
  return apiRequest<{ admin: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getAdminSessionApi(): Promise<ApiResponse<{ admin: AdminUser }>> {
  return apiRequest<{ admin: AdminUser }>('/auth/me', {
    method: 'GET',
  });
}

export async function logoutAdminApi(): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}
