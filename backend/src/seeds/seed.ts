import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../models/Course';
import { Lecture } from '../models/Lecture';

dotenv.config();

const sampleCourses = [
  {
    title: 'Modern Full-Stack Web Development with Next.js & Node.js',
    description:
      'Master building robust, production-ready full-stack applications with Next.js App Router, Express, TypeScript, and MongoDB. Learn modern architecture, caching, and state management.',
    price: 89.99,
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    lectures: [
      {
        title: 'Introduction to Next.js App Router & Server Components',
        description: 'Understand the fundamental mental shift with React Server Components, server actions, and folder-based routing.',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        order: 1,
        duration: '14:20',
      },
      {
        title: 'Designing Scalable REST APIs with Express & TypeScript',
        description: 'Learn how to structure controllers, models, and routes using the MVC pattern for clean enterprise codebases.',
        videoUrl: 'https://www.youtube.com/embed/1hpgI56-mG0',
        order: 2,
        duration: '18:45',
      },
      {
        title: 'Database Persistence & Schema Design with MongoDB & Mongoose',
        description: 'Connecting to MongoDB Atlas, defining indexed schemas, validation hooks, and relational referencing.',
        videoUrl: 'https://www.youtube.com/embed/b8ZUzPswbzs',
        order: 3,
        duration: '22:10',
      },
      {
        title: 'JWT Authentication & Protected Routing Middleware',
        description: 'Securing routes with bearer token verification, role-based access control, and token refresh mechanisms.',
        videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
        order: 4,
        duration: '16:30',
      },
    ],
  },
  {
    title: 'TypeScript from Fundamentals to Advanced Type Gymnastics',
    description:
      'Deep dive into TypeScript: Generics, conditional types, mapped types, utility types, and building bulletproof libraries and web backends.',
    price: 69.99,
    thumbnail:
      'https://images.unsplash.com/photo-1516116211227-bbc13c74a367?auto=format&fit=crop&w=1200&q=80',
    lectures: [
      {
        title: 'TypeScript Foundations & Strict Type Safety',
        description: 'Configuring tsconfig for enterprise applications and understanding primitive and complex types.',
        videoUrl: 'https://www.youtube.com/embed/ahCwqrYqo9o',
        order: 1,
        duration: '11:15',
      },
      {
        title: 'Generics, Constraints & Utility Types in Action',
        description: 'How to write flexible, reusable functions and interfaces using generics, Pick, Omit, and Partial.',
        videoUrl: 'https://www.youtube.com/embed/d56mG7DezGs',
        order: 2,
        duration: '15:40',
      },
    ],
  },
  {
    title: 'Tailwind CSS & Modern UI Component Engineering',
    description:
      'Learn how to build sleek, accessible, responsive user interfaces using Tailwind CSS utility classes, design tokens, and clean component patterns.',
    price: 49.99,
    thumbnail:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    lectures: [
      {
        title: 'Design Systems & Responsive Layouts with Tailwind',
        description: 'Creating mobile-first responsive flex and grid layouts with seamless dark mode support.',
        videoUrl: 'https://www.youtube.com/embed/mr15Xzb1Few',
        order: 1,
        duration: '13:50',
      },
      {
        title: 'Micro-interactions, Transitions & Animations',
        description: 'Polishing your UI with smooth state transitions, hover effects, and skeleton loaders.',
        videoUrl: 'https://www.youtube.com/embed/_9mTJ84uL1Q',
        order: 2,
        duration: '17:20',
      },
    ],
  },
  {
    title: 'MongoDB Atlas Mastery & Query Optimization',
    description:
      'From simple CRUD to complex aggregation pipelines, indexing strategies, and high-performance document data modeling.',
    price: 59.99,
    thumbnail:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    lectures: [
      {
        title: 'Setting Up MongoDB Atlas Cluster & Network Access',
        description: 'Deploying your cloud MongoDB database, configuring whitelists, and database user security.',
        videoUrl: 'https://www.youtube.com/embed/Ofktxvg2dUw',
        order: 1,
        duration: '09:45',
      },
      {
        title: 'Aggregation Pipelines & Complex Relationships',
        description: 'Mastering $match, $lookup, $group, and $project for rich data aggregation without N+1 queries.',
        videoUrl: 'https://www.youtube.com/embed/Kk6Er0c7srU',
        order: 2,
        duration: '21:05',
      },
    ],
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';

  console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
  try {
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully. Clearing existing courses and lectures...');

    await Course.deleteMany({});
    await Lecture.deleteMany({});

    for (const courseData of sampleCourses) {
      const { lectures, ...courseInfo } = courseData;
      const createdCourse = await Course.create(courseInfo);
      console.log(`[Seed] Created Course: "${createdCourse.title}" (ID: ${createdCourse._id})`);

      for (const lectureData of lectures) {
        await Lecture.create({
          ...lectureData,
          courseId: createdCourse._id,
        });
      }
      console.log(`  └─ Added ${lectures.length} lectures.`);
    }

    console.log('\n[Seed Completed] Successfully seeded database with realistic courses & lectures!');
    process.exit(0);
  } catch (error: any) {
    console.error('[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  }
}

seedDatabase();

