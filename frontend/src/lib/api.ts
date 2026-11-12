import { Course, Lecture, ApiResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lms_admin_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lms_admin_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lms_admin_token');
    localStorage.removeItem('lms_admin_user');
  }
};

export const getStoredAdminUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('lms_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredAdminUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lms_admin_user', JSON.stringify(user));
  }
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
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

// Course APIs
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
  return apiRequest<Course>(
    '/courses',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true
  );
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
  return apiRequest<Course>(
    `/courses/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    true
  );
}

export async function deleteCourse(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(
    `/courses/${id}`,
    {
      method: 'DELETE',
    },
    true
  );
}

// Lecture APIs
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
  return apiRequest<Lecture>(
    `/courses/${courseId}/lectures`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true
  );
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
  return apiRequest<Lecture>(
    `/lectures/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    true
  );
}

export async function deleteLecture(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(
    `/lectures/${id}`,
    {
      method: 'DELETE',
    },
    true
  );
}

// Auth APIs
export async function loginAdminApi(email: string, password: string): Promise<ApiResponse<{
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}>> {
  return apiRequest<{
    token: string;
    admin: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

