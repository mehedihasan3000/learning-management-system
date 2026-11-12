export interface Lecture {
  _id: string;
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  lectureCount?: number;
  lectures?: Lecture[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

