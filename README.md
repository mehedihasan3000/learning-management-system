# EduStream - Full-Stack Learning Management System (LMS)

A simplified full-stack Learning Management System (LMS) featuring a **Student Panel** for browsing courses and streaming video lectures, and a protected **Admin Dashboard** for comprehensive course and lecture CRUD management.

---

## 🚀 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | **Next.js** (App Router, React 19, TypeScript), **Tailwind CSS**, **Gravity UI Icons** (`@gravity-ui/icons`), **Better Auth** with JWT |
| **Backend** | **Node.js**, **Express.js**, **TypeScript**, **MVC Architecture** (Models, Views/Responses, Controllers, Routes, Middlewares) |
| **Database** | **MongoDB** (Mongoose ODM) with support for MongoDB Atlas & Local instances |
| **Authentication** | **JWT Bearer Tokens** with role-based access control and admin session persistence |

---

## 📁 Project Structure

```text
learning-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                   # Mongoose connection with error handling
│   │   ├── controllers/
│   │   │   ├── authController.ts       # Admin login & JWT verification
│   │   │   ├── courseController.ts     # Course CRUD & lecture count aggregation
│   │   │   └── lectureController.ts    # Lecture CRUD scoped to courses
│   │   ├── middlewares/
│   │   │   └── authMiddleware.ts       # JWT Bearer token authentication guard
│   │   ├── models/
│   │   │   ├── Course.ts               # Course Mongoose schema & virtuals
│   │   │   └── Lecture.ts              # Lecture Mongoose schema (courseId ref)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts           # /api/auth endpoints
│   │   │   ├── courseRoutes.ts         # /api/courses endpoints
│   │   │   └── lectureRoutes.ts        # /api/lectures endpoints
│   │   ├── seeds/
│   │   │   └── seed.ts                 # Database seeder with 4 courses & realistic video lectures
│   │   └── index.ts                    # Express app initialization & server entry
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   │   ├── courses/[id]/lectures/ # Admin Lecture Management (CRUD)
│   │   │   │   ├── login/                 # Admin Authentication Page
│   │   │   │   └── page.tsx               # Admin Course Management Dashboard
│   │   │   ├── api/auth/[...all]/         # Better Auth Next.js API Route Handler
│   │   │   ├── courses/[id]/              # Student Course View & Video Player
│   │   │   ├── globals.css                # Tailwind styling
│   │   │   ├── layout.tsx                 # Root layout with AuthProvider & Navbar
│   │   │   └── page.tsx                   # Student Catalog & Filter
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── ConfirmDeleteModal.tsx # Safe delete confirmation modal
│   │   │   │   ├── CourseModal.tsx        # Create/Edit Course modal
│   │   │   │   └── LectureModal.tsx       # Create/Edit Lecture modal with preview
│   │   │   ├── CourseCard.tsx             # Responsive Course Card with thumbnail fallback
│   │   │   ├── Footer.tsx                 # Footer
│   │   │   ├── Navbar.tsx                 # Responsive Navigation & Auth indicator
│   │   │   └── VideoPlayer.tsx            # Embedded responsive video player (YouTube/Vimeo)
│   │   ├── context/
│   │   │   └── AuthContext.tsx            # Auth context & token manager
│   │   ├── lib/
│   │   │   ├── api.ts                     # Strongly-typed backend API client
│   │   │   ├── auth.ts                    # Better Auth server instance (JWT plugin)
│   │   │   └── auth-client.ts             # Better Auth client
│   │   └── types/
│   │       └── index.ts                   # TypeScript interfaces (Course, Lecture, Admin)
│   ├── .env.local
│   ├── package.json
│   └── tsconfig.json
│
├── Learning_Management_System.md           # Requirement specifications
├── package.json                            # Root scripts runner
└── README.md
```

---

## ⚙️ Quick Start

### 1. Environment Configuration

#### Backend (`backend/.env`):
Set your MongoDB Atlas connection string (or use local MongoDB):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=super-secret-jwt-key-for-lms-platform-2026
BETTER_AUTH_SECRET=super-secret-jwt-key-for-lms-platform-2026
ADMIN_EMAIL=admin@lms.local
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:3000
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=super-secret-jwt-key-for-lms-platform-2026
BETTER_AUTH_URL=http://localhost:3000
```

---

### 2. Seed Database (Optional but Recommended)
Populates MongoDB with 4 rich courses and multiple video lessons with embeddable YouTube links:
```bash
npm run seed
```

---

### 3. Run Development Servers

In terminal 1 (Express Backend on port 5000):
```bash
npm run dev:backend
```

In terminal 2 (Next.js Frontend on port 3000):
```bash
npm run dev:frontend
```

Now open:
- **Student Catalog**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API**: [http://localhost:5000/api/courses](http://localhost:5000/api/courses)

---

## 🔑 Default Admin Credentials

- **Email**: `admin@lms.local`
- **Password**: `admin123`
- *(Or click the "Auto-fill" button on the Admin Login page for instant one-click login)*

---

## 📡 API Endpoints

### Public Endpoints (Student & Catalog)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/courses` | Get all courses with lecture counts |
| `GET` | `/api/courses/:id` | Get course details and associated lectures |
| `GET` | `/api/courses/:courseId/lectures` | Get all lectures for a specific course |
| `GET` | `/api/lectures/:id` | Get single lecture by ID |
| `GET` | `/api/health` | Backend API health check |

### Protected Endpoints (Admin - Requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin and return JWT token |
| `POST` | `/api/courses` | Create new course (title, description, price, thumbnail) |
| `PUT` | `/api/courses/:id` | Update existing course |
| `DELETE`| `/api/courses/:id` | Delete course and cascade delete associated lectures |
| `POST` | `/api/courses/:courseId/lectures` | Add new lecture to course (title, description, videoUrl, order, duration) |
| `PUT` | `/api/lectures/:id` | Update lecture |
| `DELETE`| `/api/lectures/:id` | Delete lecture |

---

## ✨ Features Checklist

- [x] **Student Panel**:
  - [x] Responsive course catalog with live search & price filter (All, Free, Paid)
  - [x] Course cards with thumbnail fallback, price tag, and lecture counter
  - [x] Course details view with complete curriculum playlist
  - [x] Embedded interactive video player (supports YouTube, Vimeo, direct MP4)
  - [x] Next and Previous lecture navigation controls
  - [x] Active lecture highlighting
- [x] **Admin Dashboard**:
  - [x] Simple, working admin authentication with JWT
  - [x] Protected routes (automatic redirection if unauthenticated)
  - [x] Course CRUD (Create, Read, Update, Delete with cascade cleanup)
  - [x] Lecture CRUD (Add, View, Edit, Delete lectures scoped to course)
  - [x] Real-time thumbnail preview and video embed preview modals
- [x] **UI/UX & Architecture**:
  - [x] Strict MVC pattern on Node.js/Express backend with TypeScript
  - [x] Loading skeleton states, empty states, and error handling with retry actions
  - [x] Built using Tailwind CSS and official Gravity UI Icons (`@gravity-ui/icons`)
  - [x] Better Auth with JWT plugin configuration in Next.js

